import { Controller, Post, Body } from '@nestjs/common';

import { S3Service } from '../services/file-uploader.service';
import { PreSignedUrlDto } from 'src/common/dto/pre-signed-url-dto';
import { ApiResponse } from '../../../common/interfaces/api-response.interface';

@Controller('s3-signed-url')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  async getPreSignedUrl(@Body() body: PreSignedUrlDto): Promise<ApiResponse<{ preSignedUrl: string, filename: string }>> {
    const { contentType } = body;
    const extension = contentType.split('/')[1];
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.${extension}`;

    try {
      const preSignedUrl = await this.s3Service.getPreSignedUrl(filename, contentType);
      return { statusCode: 200, status: 'success', data: { preSignedUrl, filename } };
    } catch (err) {
      return { statusCode: 500, status: 'error', message: err.message || 'Could not generate signed URL. Please try again later.' };
    }
  }
}
