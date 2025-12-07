import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongodb:27017/weatherDB'),
    UsersModule,
    AuthModule,
    PokemonModule,
    MongooseModule.forFeature([
      { 
        name: Weather.name,
        schema: WeatherSchema,        
        collection: 'weathersCollection'
      }    
    ])
  ],
  controllers: [WeatherController],
  providers: [WeatherService ],
})
export class WeatherModule {}