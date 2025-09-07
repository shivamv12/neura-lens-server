import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import s3StorageConfig from '../../config/s3-storage.config';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
  imports: [ConfigModule.forFeature(s3StorageConfig)],
})

export class MediaModule {}
