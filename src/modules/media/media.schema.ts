import { Schema, model, Document } from 'mongoose';

export interface IMediaRecords extends Document {
  fileName: string;
  s3Url: string;
  contentType: string;
  size?: number;
  width?: number;
  height?: number;
  deviceId?: string;
  userIp?: string;
  deviceType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaRecordsSchema = new Schema<IMediaRecords>({
  fileName: { type: String, required: true },
  s3Url: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number },
  width: { type: Number },
  height: { type: Number },
  deviceId: { type: String },
  userIp: { type: String },
  deviceType: { type: String },
}, { timestamps: true });

export const MediaRecordsModel = model<IMediaRecords>('MediaRecords', MediaRecordsSchema);
