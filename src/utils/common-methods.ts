import { ProcessingStatus } from "src/modules/media/media.schema";

/**
 * Formats uptime (in seconds) into a human-readable string.
 * Example: 3661 → "1h 1m 1s"
 *
 * @param seconds - Uptime in seconds
 * @returns Formatted string in "Xh Xm Xs" format
 */
export const formatUptime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

/**
 * Converts a byte value into megabytes string with 2 decimal precision.
 * Example: 1048576 → "1.00 MB"
 *
 * @param bytes - Number of bytes
 * @returns String representing size in megabytes, e.g., "1.00 MB"
 */
export const bytesToMB = (bytes: number): string => {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

/**
 * Parses the response returned by an AI detection service.
 * Extracts `modelDetails`, `miscDetails`, `content` and assigns a `ProcessingStatus`.
 *
 * @param detectionResponse - Raw response object from AI detection service
 * @returns An object containing:
 *   - content: parsed content from AI
 *   - miscDetails: auxiliary info like role, refusal, reasoning
 *   - modelDetails: model metadata including usage, object, model, provider
 *   - status: ProcessingStatus (SUCCESS or could be modified based on errors)
 */
export const parseDetectionResponse = (detectionResponse: any): {
  content: any;
  miscDetails: any;
  modelDetails: any;
  status: ProcessingStatus;
} => {
  // Extracting choices-message, usage and model-details from `detectionResponse`
  const { usage, provider, model, object, choices } = detectionResponse;
  const { content, role, refusal, reasoning } = choices[0]?.message ?? {};

  const miscDetails = { role, refusal, reasoning };
  const modelDetails = {
    usage: usage ?? {},
    object: object ?? null,
    model: model ?? "unknown",
    provider: provider ?? "unknown",
  };

  let parsedContent: any = {};
  if (content) {
    // Sanitize AI response content
    const sanitizedContent = sanitizeAIResponse(content);
    try {
      parsedContent = JSON.parse(sanitizedContent);
    } catch (err) {
      parsedContent = { overview: content }; // fallback if JSON parsing fails
    }
  }

  return { modelDetails, miscDetails, content: parsedContent, status: ProcessingStatus.SUCCESS };
};

/**
 * Sanitizes AI model response strings to remove Markdown code fences.
 * Useful to ensure string can safely be JSON.parsed.
 *
 * Example:
 *   Input: "```json { \"key\": \"value\" } ```"
 *   Output: "{ \"key\": \"value\" }"
 *
 * @param content - Raw string returned by AI model
 * @returns Sanitized string ready for JSON parsing
 */
export const sanitizeAIResponse = (content: string): string => {
  if (!content) return "";

  let cleaned = content.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  }

  return cleaned;
};
