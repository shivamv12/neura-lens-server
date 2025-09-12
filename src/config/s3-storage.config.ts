import { registerAs } from '@nestjs/config';

export default registerAs('s3-bucket-storage', () => ({
  bucketName: process.env.AWS_S3_BUCKET,
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  cloudFrontBaseUrl: process.env.AWS_CLOUD_FRONT_ENDPOINT,
}));
