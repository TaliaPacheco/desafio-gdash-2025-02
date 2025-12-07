import { NestFactory } from '@nestjs/core';
import { connect } from 'mongoose';

async function cleanAndSeed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/weatherDB';
    const connection = await connect(uri);
    
    await connection.connection.collection('weathersCollection').deleteMany({});
    console.log('✅ Coleção de clima limpa!');
    
    const weatherData = [
      {
        coord: {
          lon: -49.3,
          lat: -25.5,
        },
        temperature: 28,
        percent_humidity: 65,
        feels_like: 30,
        temperature_min: 22,
        temperature_max: 32,
        pressure: 1013,
        visibility_level: 10000,
        location: 'Curitiba, Brasil',
        weather_condition: {
          type: 'Sunny',
          description: 'Céu limpo e ensolarado',
        },
        rain_probability: 10,
        wind: {
          speed: 11,
          deg: 45,
          gust: 19,
        },
        createdAt: new Date(),
      },
      {
        coord: {
          lon: -49.3,
          lat: -25.5,
        },
        temperature: 26,
        percent_humidity: 72,
        feels_like: 28,
        temperature_min: 21,
        temperature_max: 30,
        pressure: 1012,
        visibility_level: 9500,
        location: 'Curitiba, Brasil',
        weather_condition: {
          type: 'Partly Cloudy',
          description: 'Parcialmente nublado',
        },
        rain_probability: 20,
        wind: {
          speed: 9,
          deg: 90,
          gust: 15,
        },
        createdAt: new Date(),
      },
      {
        coord: {
          lon: -49.3,
          lat: -25.5,
        },
        temperature: 24,
        percent_humidity: 78,
        feels_like: 25,
        temperature_min: 20,
        temperature_max: 28,
        pressure: 1011,
        visibility_level: 8000,
        location: 'Curitiba, Brasil',
        weather_condition: {
          type: 'Cloudy',
          description: 'Nublado',
        },
        rain_probability: 40,
        wind: {
          speed: 13,
          deg: 180,
          gust: 22,
        },
        createdAt: new Date(),
      },
    ];

    const result = await connection.connection.collection('weathersCollection').insertMany(weatherData);
    console.log(`✅ ${result.insertedCount} registros inseridos com sucesso!`);
    
    await connection.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

cleanAndSeed();
