import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import databaseConfig from './config/database.config';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', cache: true, load: [databaseConfig] }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: parseInt(process.env.RATE_LIMIT ?? '10', 10) }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, MediaModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('Mongoose');
        const dbConfig = configService.get<ConfigType<typeof databaseConfig>>('database')!;

        return {
          uri: dbConfig.uri, dbName: dbConfig.name, user: dbConfig.user, pass: dbConfig.password,
          connectionFactory: (connection) => {
            if (connection.readyState === 1) logger.log('✅ MongoDB connected.');

            // Attached listeners
            connection.on('error', (err) => logger.error('❌ MongoDB connection error:', err));
            connection.on('disconnected', () => logger.warn('⚠️ MongoDB disconnected'));

            return connection;
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
