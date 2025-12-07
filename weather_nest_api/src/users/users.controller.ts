import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    return this.usersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
