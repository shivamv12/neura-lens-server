/**
 * Formats uptime (in seconds) into human-readable string
 * Example: 3661 → "1h 1m 1s"
 */
export const formatUptime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

/**
 * Converts bytes into megabytes string with 2 decimal precision
 * Example: 1048576 → "1.00 MB"
 */
export const bytesToMB = (bytes: number): string => {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

/**
 * Utility to sanitize AI model responses
 * Removes Markdown code fences (```json ... ```)
 * so the string can be safely JSON.parsed.
 *
 * @param content Raw string returned by AI model
 * @returns Cleaned JSON string (without fences)
 */
export const sanitizeAIResponse = (content: string): string => {
  if (!content) return "";

  let cleaned = content.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  }

  return cleaned;
};
