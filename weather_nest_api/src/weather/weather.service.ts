import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { Model } from 'mongoose';
import { Parser } from 'json2csv';
import OpenAI from 'openai';
import { flattenWeather } from '../utils/flattenWeatherRecord';

@Injectable()
export class WeatherService {
     private openai: OpenAI;

    constructor(
        @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>
    ) {
        console.log(">> Inicializando OpenAI com chave:", process.env.OPENAI_API_KEY);
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async createWeather(data: Weather): Promise<Weather> {
        console.log(">> salvando no banco:", data)
        const created = new this.weatherModel(data); 
        return created.save();
    };

    async findAll() {
        const records = await this.weatherModel.find().sort({ createdAt: -1 });
        
        return records.map(record => ({
            coord: {
                lat: record.coord?.lat || 0,
                lon: record.coord?.lon || 0,
            },
            temp: record.temperature,
            feels_like: record.feels_like,
            temp_max: record.temperature_max,
            temp_min: record.temperature_min,
            pressure: record.pressure || 1013,
            humidity: record.percent_humidity,
            visibility: record.visibility_level,
            wind: {
                speed: record.wind?.speed || 0,
                gust: record.wind?.gust || 0,
                deg: record.wind?.deg || 0,
            },
            location: record.location || 'Desconhecida',
            description: record.weather_condition?.description || '',
        }));
    }

    async exportCsv() {
        const records = await this.weatherModel.find().lean();

        const flat = records.map(r => flattenWeather(r));

        const parser = new Parser({
            fields: Object.keys(flat[0] || {}),
        });

        const csv = parser.parse(flat);

        return csv;
    }

    async exportXlsx(): Promise<any> {
        const data = await this.findAll();
        const records = await this.weatherModel.find().lean();

        const flat = records.map(r => flattenWeather(r));

        const parser = new Parser();
        const csv = parser.parse(flat);

        return csv;
    }

    async generateInsights() {
        const records = await this.findAll();

        if (records.length === 0) {
            return {
                avgTemp: 0,
                avgHumidity: 0,
                maxWindSpeed: 0,
                totalRecords: 0,
                trend: 'N/A',
                comfortScore: 0,
                dayClassification: 'Sem dados',
                alerts: [],
                summary: 'Nenhum dado disponível',
                aiInsight: 'Nenhum dado disponível para análise'
            };
        }

        const temps = records.map(r => r.temp || 0);
        const humidity = records.map(r => r.humidity || 0);
        const winds = records.map(r => r.wind?.speed || 0);
        
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const avgHumidity = humidity.reduce((a, b) => a + b, 0) / humidity.length;
        const maxWindSpeed = Math.max(...winds);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        const trend = this.calculateTrend(temps);
        const comfortScore = this.calculateComfortScore(avgTemp, avgHumidity);
        const dayClassification = this.classifyDay(avgTemp, avgHumidity, maxWindSpeed);
        const alerts = this.generateAlerts(avgTemp, avgHumidity, maxWindSpeed);

        const aiInsight = await this.generateAIInsight(
            avgTemp,
            avgHumidity,
            maxWindSpeed,
            trend,
            dayClassification,
            alerts
        );

        return {
            avgTemp: parseFloat(avgTemp.toFixed(1)),
            avgHumidity: parseFloat(avgHumidity.toFixed(1)),
            maxWindSpeed: parseFloat(maxWindSpeed.toFixed(1)),
            minTemp: parseFloat(minTemp.toFixed(1)),
            maxTemp: parseFloat(maxTemp.toFixed(1)),
            totalRecords: records.length,
            trend,
            comfortScore,
            dayClassification,
            alerts,
            summary: `Temp média: ${avgTemp.toFixed(1)}°C | Umidade: ${avgHumidity.toFixed(1)}% | Vento máx: ${maxWindSpeed.toFixed(1)} mph`,
            aiInsight
        };
    }

    private async generateAIInsight(
        temp: number,
        humidity: number,
        windSpeed: number,
        trend: string,
        classification: string,
        alerts: string[]
    ): Promise<string> {
        try {
            const prompt = `Analise os dados climáticos abaixo e gere um resumo breve e útil em português:
            - Temperatura média: ${temp.toFixed(1)}°C
            - Umidade: ${humidity.toFixed(1)}%
            - Velocidade máxima do vento: ${windSpeed.toFixed(1)} mph
            - Tendência: ${trend}
            - Classificação: ${classification}
            - Alertas: ${alerts.length > 0 ? alerts.join(', ') : 'Nenhum'}
            
            Gere um texto natural e conciso (máximo 3-4 linhas) descrevendo as condições climáticas e recomendações.`;

            const message = await this.openai.responses.create({
                model: 'gpt-5.1',
                input: prompt
            });

            return message.output_text
        } catch (error) {
            console.error('Erro ao gerar insight com IA:', error);
            return 'Erro ao gerar análise com IA';
        }
    }

    private calculateTrend(temps: number[]): string {
        const firstHalf = temps.slice(0, Math.floor(temps.length / 2));
        const secondHalf = temps.slice(Math.floor(temps.length / 2));
        const avgFirstHalf = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const avgSecondHalf = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        return avgSecondHalf > avgFirstHalf ? '📈 Subindo' : avgSecondHalf < avgFirstHalf ? '📉 Caindo' : '➡️ Estável';
    }

    private calculateComfortScore(temp: number, humidity: number): number {
        let score = 100;
        if (temp < 15 || temp > 30) score -= 20;
        else if (temp < 18 || temp > 28) score -= 10;
        if (humidity < 30 || humidity > 70) score -= 20;
        else if (humidity < 40 || humidity > 60) score -= 10;
        return Math.max(0, score);
    }

    private classifyDay(temp: number, humidity: number, windSpeed: number): string {
        if (temp < 15) return '❄️ Frio';
        if (temp > 28 && humidity > 65) return '☀️ Quente e úmido';
        if (temp > 28) return '🔥 Quente';
        if (humidity > 75) return '🌧️ Chuvoso';
        return '😊 Agradável';
    }

    private generateAlerts(temp: number, humidity: number, windSpeed: number): string[] {
        const alerts: string[] = [];
        if (temp > 32) alerts.push('🔴 Calor extremo');
        if (temp < 0) alerts.push('❄️ Frio intenso');
        if (humidity > 80) alerts.push('💧 Alta umidade');
        if (windSpeed > 25) alerts.push('💨 Ventos fortes');
        return alerts;
    }


    async getDashboardInfo() {
        const lastWeatherRecord = await this.weatherModel.findOne().sort({ createdAt: -1 });
        
        return {
            lastWeatherRecord,
        };
    }

}