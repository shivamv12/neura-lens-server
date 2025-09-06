import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import s3StorageConfig from '../../config/s3-storage.config';
import { FileUploaderService } from './file-uploader.service';
import { FileUploaderController } from './file-uploader.controller';

@Module({
  controllers: [FileUploaderController],
  providers: [FileUploaderService],
  exports: [FileUploaderService],
  imports: [ConfigModule.forFeature(s3StorageConfig)],
})

export class FileUploaderModule {}
