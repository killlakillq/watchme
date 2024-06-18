import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP, CORS } from './common/constants';

async function bootstrap() {
  const configService = new ConfigService();

  const origin = configService.get('CORS_ORIGIN');
  const port = configService.get('APP_PORT');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(APP.GLOBAL_PREFIX);
  app.enableCors({
    origin,
    methods: CORS.METHODS,
    credentials: true
  });

  app.use(helmet());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Watchme')
    .setDescription('The watchme API details')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

bootstrap();
