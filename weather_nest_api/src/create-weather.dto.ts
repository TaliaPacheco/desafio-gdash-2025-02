export class CreateWeatherDto {
  lat: number;
  lon: number;
  temperature: number;
  percent_humidity: number;
  wind: {
    speed: number;
    deg: number;
  };
  weather_condition: {
    type: string;
    description: string;
  };
  rain_probability: number;
  feels_like: number;
  temperature_min: number;
  temperature_max: number;
  visibility_level: number;
}