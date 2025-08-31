import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

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

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('🧠 Neura Lens APIs')
    .setDescription('API documentation for Neura-Lens backend server!')
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
