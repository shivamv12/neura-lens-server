import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';

import { BASE_URLS } from '../../config/api-endpoints';

@Injectable()
export class AIDetectionService {

  constructor(private readonly openai: OpenAI) { }

  async detectImageFromUrl(filename: string, prompt = 'What is in this image?') {
    const completion = await this.openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `${BASE_URLS.cloudFrontBaseUrl}/${filename}` } },
          ],
        },
      ],
    });

    console.log('Console: image-response:', completion.choices);
    return completion.choices[0].message;
  }
}
