import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import storageConfig from '../../config/s3-storage.config';
import { ImageRecordsDto } from 'src/common/dto/pre-signed-url-dto';
import { IImageRecords, ImageRecordsModel } from './file-uploader.schema';

@Injectable()
export class FileUploaderService {
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

  async getPreSignedUrl(filename: string, contentType: string): Promise<string> {
    const commandInput: PutObjectCommandInput = {
      Key: filename,
      Bucket: this.bucketName,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(commandInput);
    try {
      return await getSignedUrl(this.s3, command, { expiresIn: 60 * 2 }); // Valid for only 2 min
    } catch (err) {
      throw new BadRequestException('Could not generate signed URL. Please try again later.');
    }
  }

  async createImageRecord(imageRecordsDto: ImageRecordsDto): Promise<IImageRecords> {
    const image = new ImageRecordsModel(imageRecordsDto);
    return image.save();
  }
}
