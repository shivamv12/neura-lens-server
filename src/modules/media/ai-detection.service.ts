import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';

import s3StorageConfig from '../../config/s3-storage.config';

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

  async detectImageFromUrl(filename: string, prompt = 'What is in this image?') {
    const completion = await this.openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
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

    return completion.choices[0].message;
  }
}
