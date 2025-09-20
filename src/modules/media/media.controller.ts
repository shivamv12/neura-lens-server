import { Types } from 'mongoose';
import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';

import { MediaService } from './media.service';
import { MediaRecordsDto, PreSignedUrlDto } from './media.dto';

/** Controller to handle media-related endpoints (uploads, presigned URLs, and completion). */
@Controller('media')
export class MediaController {
  constructor(private readonly MSV: MediaService) { }

  // Returns a pre-signed S3 URL for uploading an image.
  @Post('/presigned-url')
  async getPreSignedUrl(@Body() body: PreSignedUrlDto) {
    const { contentType } = body;
    const extension = contentType.split('/')[1];
    const filename = `${new Types.ObjectId().toHexString()}.${extension}`;
    const preSignedUrl = await this.MSV.getPreSignedUrl({ filename, contentType });

    return { preSignedUrl, filename };
  }

  // Returns all uploaded media for a specific device with CDN/S3 URLs.
  @Get('/uploads')
  async getMediaRecords(@Query('deviceId') deviceId?: string) {
    if (!deviceId) return { files: [] };

    const uploads = await this.MSV.getUploadsByDevice(deviceId);
    const files = uploads.map((item): { filename: string, uploadedAt: Date } => ({
      filename: item.s3Key,
      uploadedAt: item.createdAt
    }));

    return { files };
  }

  // Marks an upload as complete and stores metadata in the database.
  @Post('/uploads/complete')
  async createMediaRecord(@Body() body: MediaRecordsDto, @Req() req: Request): Promise<any> {
    const deviceId = body.deviceId?.toLowerCase();
    const deviceType = body.deviceType;
    const userIp =
      (req as any).ip ||
      (req.headers['x-forwarded-for'] as string | undefined) ||
      (req as any).socket?.remoteAddress || undefined;

    return this.MSV.createMediaRecord({ ...body, userIp, deviceId, deviceType });
  }
}
