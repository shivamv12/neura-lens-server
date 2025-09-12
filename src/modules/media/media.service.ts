import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService, ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { MediaRecordsDto } from './media.dto';
import storageConfig from '../../config/s3-storage.config';
import { IMediaRecords, MediaRecords } from './media.schema';

@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  public bucketName: string;

  constructor(
    @InjectModel(MediaRecords.name)
    private readonly mediaModel: Model<IMediaRecords>,
    private readonly configService: ConfigService,
  ) {
    const cfg = this.configService.get<ConfigType<typeof storageConfig>>('storage')!;
    this.bucketName = cfg.bucketName!;
    this.s3 = new S3Client({
      region: cfg.region,
      credentials: {
        accessKeyId: cfg.accessKeyId!,
        secretAccessKey: cfg.secretAccessKey!,
      },
      endpoint: cfg.endpoint,
    });
  }

  async getPreSignedUrl(payload: { filename: string, contentType: string }): Promise<string> {
    const { filename, contentType } = payload;
    const commandInput: PutObjectCommandInput = { Key: filename, Bucket: this.bucketName, ContentType: contentType, ServerSideEncryption: "AES256" };

    const command = new PutObjectCommand(commandInput);
    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 2 }); // Valid for only 2 min
  }

  async createMediaRecord(mediaRecordsDto: MediaRecordsDto): Promise<IMediaRecords> {
    return await this.mediaModel.create(mediaRecordsDto);
  }
}
