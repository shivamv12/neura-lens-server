import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PreSignedUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'Empty file mimetype detected! Please try again.' })
  @Matches(/^image\/(jpeg|png|jpg|heic|heif)$/i, { message: 'Invalid file type! Only images with PNG|JPG|JPEG|HEIC|HEIF are allowed.' })
  contentType: string;
}
