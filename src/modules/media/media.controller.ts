import { Types } from 'mongoose';
import { Controller, Post, Body, Req } from '@nestjs/common';

import { MediaService } from './media.service';
import { MediaRecordsDto, PreSignedUrlDto } from './media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly msv: MediaService) { }

  @Post('/presigned-url')
  async getPreSignedUrl(@Body() body: PreSignedUrlDto) {
    const { contentType } = body;
    const extension = contentType.split('/')[1];
    const filename = `${new Types.ObjectId().toHexString()}.${extension}`;
    const preSignedUrl = await this.msv.getPreSignedUrl({ filename, contentType });

    return { preSignedUrl, filename };
  }

  @Post('/upload-complete')
  async createMediaRecord(@Body() body: MediaRecordsDto, @Req() req: Request): Promise<any> {
    const deviceId = body.deviceId || undefined;
    const deviceType = body.deviceType || undefined;
    const userIp = (req as any).ip || (req.headers['x-forwarded-for'] as string | undefined) || (req as any).socket?.remoteAddress || undefined;

    return this.msv.createMediaRecord({ ...body, userIp, deviceId, deviceType });
  }
}
