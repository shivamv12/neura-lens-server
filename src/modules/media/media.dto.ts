import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsOptional, IsNumber } from 'class-validator';

export class PreSignedUrlDto {
  @ApiProperty({
    example: ['image/png', 'image/jpeg', 'image/jpg'],
    description: 'Content type [mimeType] of the uploaded file.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Empty file mimetype detected! Please try again.' })
  @Matches(/^image\/(jpeg|png|jpg|heic|heif)$/i, {
    message: 'Invalid file type! Only images with PNG|JPG|JPEG|HEIC|HEIF are allowed.',
  })
  contentType: string;
}

export class MediaRecordsDto {
  @ApiProperty({ description: 'Original filename of the uploaded media', example: 'media1.jpg' })
  @IsString()
  filename: string;

  @ApiProperty({ description: 'AWS S3 bucket object key', example: 'uploads/media1.jpg' })
  @IsString()
  s3Key: string;

  @ApiProperty({ description: 'Size in bytes', example: 34567, required: false })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({ description: 'Image width in px', example: 1080, required: false })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({ description: 'Image height in px', example: 1920, required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Device ID as a unique identifier', example: 'device-abc123', required: false })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiProperty({ description: 'User IP address', example: '192.168.1.1', required: false })
  @IsString()
  @IsOptional()
  userIp?: string;

  @ApiProperty({ description: 'Device type', example: 'iPhone', required: false })
  @IsString()
  @IsOptional()
  deviceType?: string;
}
