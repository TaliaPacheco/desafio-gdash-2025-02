import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateWeatherDto } from './create-weather.dto';


@Controller("/weather")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHelo(): string {
    return this.appService.getHello();
  }

  @Post('logs')
  postQueueLogs(@Body() weatherData: CreateWeatherDto): string {
    console.log(weatherData);
    return this.appService.getHello();
  }
  
}

