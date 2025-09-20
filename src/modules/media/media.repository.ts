import { Injectable } from '@nestjs/common';
import { MediaRecords } from './media.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery, ProjectionType, UpdateResult, DeleteResult } from 'mongoose';

/** Simple Rule of Thumb:
  - Filter conditions → FilterQuery<T>
  - Update objects → UpdateQuery<T>
  - Create objects → Partial<T>
**/

@Injectable()
export class MediaRepository {
  constructor(@InjectModel(MediaRecords.name) private readonly mediaModel: Model<MediaRecords>) { }

  /** Finds a single media record matching the filter */
  async findOne(filter: FilterQuery<MediaRecords>): Promise<MediaRecords | null> {
    return this.mediaModel.findOne(filter).lean();
  }

  /** Finds multiple media records matching the filter, optionally using a projection */
  async find(filter: FilterQuery<MediaRecords>, projection?: ProjectionType<MediaRecords>): Promise<MediaRecords[] | []> {
    const query = this.mediaModel.find(filter).sort({ createdAt: -1 }).lean();
    if (projection) query.select(projection);
    return query;
  }

  /** Creates a new media record */
  async create(record: Partial<MediaRecords>): Promise<MediaRecords> {
    return this.mediaModel.create(record);
  }

  /** Updates a single media record matching the filter */
  async update(filter: FilterQuery<MediaRecords>, update: UpdateQuery<MediaRecords>): Promise<UpdateResult> {
    return this.mediaModel.updateOne(filter, update);
  }

  /** Updates multiple media records matching the filter */
  async updateMany(filter: FilterQuery<MediaRecords>, update: UpdateQuery<MediaRecords>): Promise<UpdateResult> {
    return this.mediaModel.updateMany(filter, update);
  }

  /** Finds a single media record matching the filter and updates it, returning the updated document */
  async findOneAndUpdate(filter: FilterQuery<MediaRecords>, update: UpdateQuery<MediaRecords>): Promise<MediaRecords | null> {
    // returnDocument: 'after' (equivalent to { new: true } in older Mongoose)
    return this.mediaModel.findOneAndUpdate(filter, update, { returnDocument: 'after' }).lean();
  }

  /** Deletes a single media record matching the filter */
  async delete(filter: FilterQuery<MediaRecords>): Promise<DeleteResult> {
    return this.mediaModel.deleteOne(filter);
  }

  /** Deletes multiple media records matching the filter */
  async deleteMany(filter: FilterQuery<MediaRecords>): Promise<DeleteResult> {
    return this.mediaModel.deleteMany(filter);
  }
}
