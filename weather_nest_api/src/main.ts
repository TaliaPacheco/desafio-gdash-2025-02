import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './weather/weather.module';
import { UsersService } from './users/users.service';
import { createDefaultUser } from './users/user.seed';

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  const usersService = app.get(UsersService);
  await createDefaultUser(usersService);

  console.log("CHAVE OPENAI:", process.env.OPENAI_API_KEY ? "OK" : "NÃO CARREGOU");

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
