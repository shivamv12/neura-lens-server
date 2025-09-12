import OpenAI from 'openai';
import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { BASE_URLS } from 'src/config/api-endpoints';
import { AIDetectionService } from './ai-detection.service';
import s3StorageConfig from '../../config/s3-storage.config';
import { MediaRecords, MediaRecordsSchema } from './media.schema';

@Module({
  imports: [
    ConfigModule.forFeature(s3StorageConfig),
    MongooseModule.forFeature([
      { name: MediaRecords.name, schema: MediaRecordsSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService, AIDetectionService,
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const storage = config.get('s3-bucket-storage');
        return new S3Client({
          region: storage.region,
          credentials: {
            accessKeyId: storage.accessKeyId,
            secretAccessKey: storage.secretAccessKey,
          },
        });
      },
    },
    {
      provide: OpenAI,
      useFactory: () => {
        return new OpenAI({
          baseURL: BASE_URLS.openRouterBaseUrl,
          apiKey: process.env.OPEN_ROUTER_API_KEY!,
        });
      },
    }
  ],
  exports: [MediaService],
})

export class MediaModule { }
