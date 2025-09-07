import { IsNotEmpty, IsString, Matches, IsOptional, IsNumber } from 'class-validator';

export class PreSignedUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'Empty file mimetype detected! Please try again.' })
  @Matches(/^image\/(jpeg|png|jpg|heic|heif)$/i, { message: 'Invalid file type! Only images with PNG|JPG|JPEG|HEIC|HEIF are allowed.' })
  contentType: string;
}

export class ImageRecordsDto {
  @IsString()
  fileName: string;

  @IsString()
  s3Url: string;

  @IsString()
  contentType: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  userIp?: string;

  @IsString()
  @IsOptional()
  deviceType?: string;
}
