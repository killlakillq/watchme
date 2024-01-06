import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP, CORS } from './common/constants';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(APP.GLOBAL_PREFIX);
  app.enableCors({
    origin: [CORS.ORIGIN],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  });

  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Watchme')
    .setDescription('The watchme API details')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
