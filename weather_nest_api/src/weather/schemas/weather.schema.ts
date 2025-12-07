import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

@Schema()
export class Weather {
  @Prop({
  type: {
    lon: Number,
    lat: Number,
  }
  })
    coord: {
      lon: number;
      lat: number;
    };


  @Prop()
  temperature: number;

  @Prop()
  percent_humidity: number;

  @Prop({
    type: {
      speed: Number,
      deg: Number,
      gust: Number,
    }
  })
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  @Prop({
    type: {
      type: String,
      description: String,
    }
  })
  weather_condition: {
    type: string;
    description: string;
  };

  @Prop()
  rain_probability: number;

  @Prop()
  feels_like: number;

  @Prop()
  temperature_min: number;

  @Prop()
  temperature_max: number;

  @Prop()
  pressure: number;

  @Prop()
  visibility_level: number;

  @Prop()
  location: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);