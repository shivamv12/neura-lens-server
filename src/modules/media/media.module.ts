import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';
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
  providers: [MediaService],
  exports: [MediaService],
})

export class MediaModule { }
