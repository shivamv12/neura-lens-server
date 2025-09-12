import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService, ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { MediaRecordsDto } from './media.dto';
import { AIDetectionService } from './ai-detection.service';
import s3StorageConfig from '../../config/s3-storage.config';
import { IMediaRecords, MediaRecords, ProcessingStatus } from './media.schema';

@Injectable()
export class MediaService {
  private bucketName: string;

  constructor(
    private readonly s3: S3Client,
    private readonly ADS: AIDetectionService,
    private readonly configService: ConfigService,
    @InjectModel(MediaRecords.name) private readonly mediaModel: Model<IMediaRecords>,
  ) {
    const cfg = this.configService.get<ConfigType<typeof s3StorageConfig>>('s3-bucket-storage')!;
    this.bucketName = cfg.bucketName!;
  }

  async getPreSignedUrl(payload: { filename: string, contentType: string }): Promise<string> {
    const { filename, contentType } = payload;
    const commandInput: PutObjectCommandInput = { Key: filename, Bucket: this.bucketName, ContentType: contentType, ServerSideEncryption: "AES256" };

    const command = new PutObjectCommand(commandInput);
    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 2 }); // Valid for only 2 min
  }

  async createMediaRecord(mediaRecordsDto: MediaRecordsDto): Promise<IMediaRecords> {
    const record = await this.mediaModel.create(mediaRecordsDto);

    try {
      const detectionResponse = await this.ADS.detectImageFromUrl(record.s3Key);
      record.processedImageDetails = detectionResponse;
      record.processingStatus = ProcessingStatus.SUCCESS;
    } catch(err) {
      record.processedImageDetails = {};
      record.processingStatus = ProcessingStatus.FAILED;
    }

    return await record.save();
  }
}
