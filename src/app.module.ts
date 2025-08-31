import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppService } from './app.service';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Time window in seconds
        limit: parseInt(process.env.RATE_LIMIT ?? '10', 10), // Requests per IP per window
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
