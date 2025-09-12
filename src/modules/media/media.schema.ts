import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MediaRecords extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop()
  size?: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  deviceId?: string;

  @Prop()
  userIp?: string;

  @Prop()
  deviceType?: string;
}

export const MediaRecordsSchema = SchemaFactory.createForClass(MediaRecords);

export type IMediaRecords = MediaRecords;
