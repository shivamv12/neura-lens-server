import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { MediaRecordsDto } from './media.dto';
import { MediaRepository } from './media.repository';
import { MediaProjections } from './media.projections';
import { AIDetectionService } from './ai-detection.service';
import s3StorageConfig from '../../config/s3-storage.config';
import { parseDetectionResponse } from 'src/utils/common-methods';
import { IMediaRecords, MediaRecords, ProcessingStatus } from './media.schema';

@Injectable()
export class MediaService {
  private bucketName: string;
  private cloudFrontBaseUrl: string;

  constructor(
    private readonly s3: S3Client,
    private readonly ADS: AIDetectionService,
    private readonly configService: ConfigService,
    private readonly mediaRepository: MediaRepository,
  ) {
    const cfg = this.configService.get<ConfigType<typeof s3StorageConfig>>('s3-bucket-storage')!;
    this.bucketName = cfg.bucketName!;
    this.cloudFrontBaseUrl = cfg.cloudFrontBaseUrl!;
  }

  /** Returns a pre-signed S3 URL for uploading a file valid for 2 minutes */
  async getPreSignedUrl(payload: { filename: string, contentType: string }): Promise<string> {
    const { filename, contentType } = payload;
    const commandInput: PutObjectCommandInput = { Key: filename, Bucket: this.bucketName, ContentType: contentType, ServerSideEncryption: "AES256" };

    const command = new PutObjectCommand(commandInput);
    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 2 }); // Valid for only 2 min
  }

  /** Creates a media record and processes it via AI detection */
  async createMediaRecord(mediaRecordsDto: MediaRecordsDto): Promise<IMediaRecords> {
    const updatedKeys: Pick<MediaRecords, 'processedImageDetails' | 'processingStatus'> = {
      processedImageDetails: {},
      processingStatus: ProcessingStatus.PENDING
    };
    try {
      const detectionResponse = await this.ADS.detectImageFromUrl(mediaRecordsDto.s3Key);
      const { modelDetails, miscDetails, content, status } = parseDetectionResponse(detectionResponse);

      updatedKeys.processingStatus = status;
      updatedKeys.processedImageDetails = { modelDetails, miscDetails, content };
    } catch (err) {
      updatedKeys.processingStatus = ProcessingStatus.FAILED;
      updatedKeys.processedImageDetails = { error: JSON.stringify(err) };
    }

    return await this.mediaRepository.create({ ...mediaRecordsDto, ...updatedKeys });
  }

  /** Fetches all media uploads for a given device using projection */
  async getUploadsByDevice(deviceId: string): Promise<IMediaRecords[]> {
    const uploadedFiles = await this.mediaRepository.find({ deviceId }, MediaProjections.uploadsList);
    uploadedFiles.map((item): string => item.s3Key = `${this.cloudFrontBaseUrl}/${item.s3Key}`);
    return uploadedFiles;
  }
}
