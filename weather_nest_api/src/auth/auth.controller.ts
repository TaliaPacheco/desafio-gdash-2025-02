import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }
    return this.authService.login(body.email, body.password);
  }
}
