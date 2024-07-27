import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import baseConfig from './configs/base.config';
import { CustomGlobalError } from './middlewares';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.enableCors(
    {
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      optionsSuccessStatus: 204,
      origin: "*"
    }
  )
  const httpRef = app.get(HttpAdapterHost);
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new CustomGlobalError(httpRef.httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  Logger.log(`Server running on port ${baseConfig().port}`, 'Bootstrap');
  await app.listen(baseConfig().port);
}
bootstrap();
