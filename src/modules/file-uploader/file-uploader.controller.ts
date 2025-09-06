import { Controller, Post, Body, Req } from '@nestjs/common';

import { FileUploaderService } from './file-uploader.service';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { ImageRecordsDto, PreSignedUrlDto } from '../../common/dto/file-uploader.dto';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(private readonly fileUploaderService: FileUploaderService) {}

  @Post('/pre-signed-url')
  async getPreSignedUrl(@Body() body: PreSignedUrlDto): Promise<ApiResponse<{ preSignedUrl: string, filename: string }>> {
    const { contentType } = body;
    const extension = contentType.split('/')[1];
    const filename = `neura-lens-core-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${extension}`;

    try {
      const preSignedUrl = await this.fileUploaderService.getPreSignedUrl(filename, contentType);
      return { statusCode: 200, status: 'success', data: { preSignedUrl, filename } };
    } catch (err) {
      return { statusCode: 500, status: 'error', message: err.message || 'Could not generate signed URL. Please try again later.' };
    }
  }

  @Post('/status')
  async createImageRecord(@Body() body: ImageRecordsDto, @Req() req: Request): Promise<ApiResponse<any>> {
    const deviceId = body.deviceId || undefined;
    const deviceType = body.deviceType || undefined;
    const userIp = (req as any).ip || (req.headers['x-forwarded-for'] as string | undefined) || (req as any).socket?.remoteAddress || undefined;

    try {
      const createdImage = await this.fileUploaderService.createImageRecord({ ...body, userIp, deviceId, deviceType });
      return { statusCode: 201, status: 'success', data: { createdImage } };
    } catch (err) {
      return { statusCode: 500, status: 'error', message: err.message || 'Could not generate signed URL. Please try again later.' };
    }
  }
}
