import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', cache: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Time window in seconds
        limit: parseInt(process.env.RATE_LIMIT ?? '10', 10), // Requests per IP per window
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const user = configService.get<string>('DB_USER');
        const pass = configService.get<string>('DB_PASS');
        const cluster = configService.get<string>('DB_CLUSTER');
        const dbName = configService.get<string>('DB_NAME');
        return {
          uri: `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`,
          dbName: dbName,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {};
