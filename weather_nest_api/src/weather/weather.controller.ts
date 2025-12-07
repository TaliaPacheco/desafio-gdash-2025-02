import { Controller, Get, Post, Body, Res, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post("logs")
  async create(@Body() data: any) {
    console.log(">> recebido:", data)
    const weatherData = this.mapWeatherData(data);
    return await this.weatherService.createWeather(weatherData as any);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("dashboard")
  async getDashboardInfo() {
    const {
      lastWeatherRecord,
    } = await this.weatherService.getDashboardInfo(); 

    console.log(">> lastWeatherRecord:", lastWeatherRecord);
    
    const {
      formmatedRecord
    } = this.formatWeatherRecords(lastWeatherRecord);

    return formmatedRecord;
  }

  private formatWeatherRecords(lastWeatherRecord: any) {
    const formmatedRecord = {
      coord: {
        lat: lastWeatherRecord.coord.lat,
        lon: lastWeatherRecord.coord.lon
      },
      temperature: lastWeatherRecord.temperature, 
      percent_humidity: lastWeatherRecord.percent_humidity, 
      wind: {
        speed: lastWeatherRecord.wind.speed,
        deg: lastWeatherRecord.wind.deg,
        gust: lastWeatherRecord.wind.gust,
      }, 
      rain_probability: lastWeatherRecord.rain_probability,
      feels_like: lastWeatherRecord.feels_like,
      temperature_min: lastWeatherRecord.temperature_min,
      temperature_max: lastWeatherRecord.temperature_max,
      pressure: lastWeatherRecord.pressure,
      visibility_level: lastWeatherRecord.visibility_level,
      location: lastWeatherRecord.location,
      weather_condition: lastWeatherRecord.weather_condition
    } 

    return {
      formmatedRecord
    };
  }

  private mapWeatherData(data: any) {
    if (!data) {
      return {};
    }

    if (data?.city || data?.coordinates) {
      const mapped = {
        location: data.city || 'Desconhecida',
        coord: {
          lat: data.coord?.lat || 0,
          lon: data.coord?.lon || 0,
        },
        temperature: data.weather?.temp || data.temp || 0,
        percent_humidity: data.weather?.humidity || data.humidity || 0,
        feels_like: data.feels_like || data.weather?.temp || 0,
        temperature_min: data.temperature_min || data.weather?.temp_min || 0,
        temperature_max: data.temperature_max || data.weather?.temp_max || 0,
        pressure: data.pressure || 1013,
        visibility_level: data.visibility || data.visibility_level || 10000,
        wind: {
          speed: data.wind || data.wind?.speed || 0,
          deg: data.wind?.deg || 0,
          gust: data.wind?.gust || 0,
        },
        weather_condition: {
          type: data.weather?.type || 'Unknown',
          description: data.weather?.description || '',
        },
        rain_probability: data.rain_probability || 0,
      };
      console.log(">> Dados mapeados:", mapped);
      return mapped;
    }

    const mapped = {
      location: data.location || 'Desconhecida',
      coord: data.coord || { lat:  -23.958807, lon: -46.331928 },
      temperature: data.temperature || 0,
      percent_humidity: data.percent_humidity || 0,
      feels_like: data.feels_like || 0,
      temperature_min: data.temperature_min || 0,
      temperature_max: data.temperature_max || 0,
      pressure: data.pressure || 1013,
      visibility_level: data.visibility_level || 10000,
      wind: data.wind || { speed: 0, deg: 0, gust: 0 },
      weather_condition: data.weather_condition || { type: 'Unknown', description: '' },
      rain_probability: data.rain_probability || 0,
    };
    console.log(">> Dados mapeados (antigo formato):", mapped);
    return mapped;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return await this.weatherService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get("export/csv")
  async exportCsv(@Res() res: Response) {
    const csv = await this.weatherService.exportCsv();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=weather.csv");

    return res.send(csv);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("export/xlsx")
  async exportXlsx(@Res() res: Response) {
    const buffer = await this.weatherService.exportXlsx();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=weather.xlsx");
    res.send(buffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("insights")
  async insights() {
    return await this.weatherService.generateInsights();
  }
}