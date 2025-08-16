import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      `${appConfig.get('sensatexAdultos').frontendUrl}`,
      `https://www.sensatexadultos.com`,
      'http://localhost:4200',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sensatex Adultos - API')
    .setDescription('REST API for e-commerce application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(appConfig.get('sensatexAdultos').port || 3000);
}
bootstrap();
