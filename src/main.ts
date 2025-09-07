import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Automatic request / response logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Security middleware
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out fields not in DTO.
      transform: true, // auto-converts types (e.g., "5" → number).
      forbidNonWhitelisted: true, // instead of stripping, throw error if extra fields are sent.
    }),
  );

  // Compression
  app.use(compression.default());

  // Global prefix
  app.setGlobalPrefix('api');

  // Global custom response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('🧠 Neura Lens APIs')
    .setDescription('API documentation for Neura Lens backend server!')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT auth in Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  // Manual logging, runs only once on bootstrap
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📜 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
