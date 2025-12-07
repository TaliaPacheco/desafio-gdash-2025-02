import { Injectable } from '@nestjs/common';
import { AppController } from './app.controller'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
