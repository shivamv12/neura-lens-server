import OpenAI from 'openai';
import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import openAiConfig from '../../config/open-ai.config';
import { AIDetectionService } from './ai-detection.service';
import s3StorageConfig from '../../config/s3-storage.config';
import { MediaRecords, MediaRecordsSchema } from './media.schema';

@Module({
  // imports → bring in other modules/configs/schemas this module depends on
  imports: [
    ConfigModule.forFeature(openAiConfig),                                  // registers OpenAI-related config
    ConfigModule.forFeature(s3StorageConfig),                               // registers S3 storage config
    MongooseModule.forFeature([                                             // registers Mongo schema/model
      { name: MediaRecords.name, schema: MediaRecordsSchema },
    ]),
  ],

  // controllers → define incoming HTTP routes/endpoints for this module
  controllers: [MediaController],

  // providers → services/factories available for injection in this module
  providers: [
    MediaService,                                                           // business logic for media handling
    AIDetectionService,                                                     // service for AI detection logic
    {
      provide: S3Client,                                                    // custom factory to configure AWS S3 client
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const s3BucketStorage = config.get('s3-bucket-storage');
        return new S3Client({
          region: s3BucketStorage.region,
          credentials: {
            accessKeyId: s3BucketStorage.accessKeyId,
            secretAccessKey: s3BucketStorage.secretAccessKey,
          },
        });
      },
    },
    {
      provide: OpenAI,                                                      // custom factory to configure OpenAI client
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const openAiConfig = config.get('open-ai-config');
        return new OpenAI({
          baseURL: openAiConfig.openRouterBaseUrl,
          apiKey: openAiConfig.openRouterSecretKey,
        });
      },
    },
  ],

  // exports → make providers/services available to other modules
  exports: [MediaService],
})

export class MediaModule { }
