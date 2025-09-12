import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ProcessingStatus { FAILED = 'failed', PENDING = 'pending', SUCCESS = 'success' };

@Schema({ timestamps: true })
export class MediaRecords extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ type: Number, default: 0 })
  size?: number;

  @Prop({ type: Number, default: 0 })
  width?: number;

  @Prop({ type: Number, default: 0 })
  height?: number;

  @Prop({ type: String, default: 'unknown' })
  deviceId?: string;

  @Prop({ type: String, default: '0.0.0.0' })
  userIp?: string;

  @Prop({ type: String, default: 'unknown' })
  deviceType?: string;
  
  @Prop({ type: Object, default: {} })
  processedImageDetails?: any;

  @Prop({ type: String, enum: ProcessingStatus, default: ProcessingStatus.PENDING })
  processingStatus?: ProcessingStatus;
}

export const MediaRecordsSchema = SchemaFactory.createForClass(MediaRecords);

export type IMediaRecords = MediaRecords;
