import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  bucketName: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT, // for Cloudflare R2
}));
