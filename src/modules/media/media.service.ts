import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { MediaRecordsDto } from './media.dto';
import storageConfig from '../../config/s3-storage.config';
import { IMediaRecords, MediaRecordsModel } from './media.schema';

@Injectable()
export class MediaService {
  private s3: S3Client;
  public bucketName: string;

  constructor(private configService: ConfigService) {
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
    const commandInput: PutObjectCommandInput = { Key: filename, Bucket: this.bucketName, ContentType: contentType };

    const command = new PutObjectCommand(commandInput);
    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 2 }); // Valid for only 2 min
  }

  async createMediaRecord(mediaRecordsDto: MediaRecordsDto): Promise<IMediaRecords> {
    const image = new MediaRecordsModel(mediaRecordsDto);
    return image.save();
  }
}
