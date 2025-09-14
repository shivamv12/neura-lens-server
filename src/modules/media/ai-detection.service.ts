import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';

import s3StorageConfig from '../../config/s3-storage.config';
import { MODEL_CONSTANTS } from 'src/constants/model-constants';

@Injectable()
export class AIDetectionService {
  private cloudFrontBaseUrl: string;

  constructor(
    private readonly openai: OpenAI,
    private readonly configService: ConfigService,
  ) {
    const cfg = this.configService.get<ConfigType<typeof s3StorageConfig>>('s3-bucket-storage')!;
    this.cloudFrontBaseUrl = cfg.cloudFrontBaseUrl!;
  }

  async detectImageFromUrl(filename: string, prompt = MODEL_CONSTANTS.IMAGE_ANALYSIS_PROMPT): Promise<any> {
    return await this.openai.chat.completions.create({
      model: MODEL_CONSTANTS.MODEL_NAME,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `${this.cloudFrontBaseUrl}/${filename}` } },
          ],
        },
      ],
    });
  }
}
