import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { APP, CORS } from '@common/constants';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const configService = new ConfigService();

  const origin = configService.get('CORS_ORIGIN');
  const port = configService.get('APP_PORT');
  const enviroment = configService.get('NODE_ENV');

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

  if (enviroment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Watchme')
      .setDescription('The watchme API details')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(port);
}

bootstrap();
