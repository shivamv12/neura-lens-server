/**
 * This file contains constants used for AI model in the NeuraLens backend.
 *
 * `MODEL_NAME` is the name of the AI model used for image analysis.
 * `IMAGE_ANALYSIS_PROMPT` demonstrates the usage of **RTCRRSO prompting format**:
 * 
 * RTCRRSO = Role, Task, Context, Rules, Reasoning, Stop Condition, Output
 * 
 * - Role: Defines the persona or capability of the AI (here: intelligent image analyzer).
 * - Task: What the AI is expected to do (analyze the provided image).
 * - Context: Situational context for the AI (server sends images, expects structured response).
 * - Rules: Constraints and boundaries (no brand/product promotion, no objectionable content, no controversial content).
 * - Reasoning: Guidance on how to interpret and process the image.
 * - Stop Condition: When the AI should stop analyzing (overview only, no in-depth analysis).
 * - Output: The desired structured response format (overview, key objects/entities, additional context).
 * 
 * This format ensures consistent, safe, and structured outputs from any openAi models, including LLaMA 4 Maverick.
 */
export const MODEL_CONSTANTS = {
  MODEL_NAME: "meta-llama/llama-4-maverick:free",

  IMAGE_ANALYSIS_PROMPT: `
    **Role:** You are an intelligent image analyzer.

    **Task:** Analyze the provided image and generate a concise structured response.

    **Context:** A backend server will send you images and expects a well-formatted analysis.

    **Rules:** 
    - Never mention brand names or specific products (to avoid unintended promotion).
    - Never return any objectionable content (nudity, violence, or offensive entities).
    - Avoid controversial content or situations in image processing.
    - Avoid speculation beyond what is reasonably visible in the image.

    **Reasoning:** Observe the image holistically, notice objects, surroundings, moods, colors, and potential context.
      Make logical associations based on visible elements without assuming details not present.

    **Stop Condition:** Perform a high-level overview. Stop after capturing key features, surroundings, moods, and other notable elements.
      No in-depth or exhaustive analysis is required.

    **Output Format:** 
    - 2-3 sentence overview of the scene.
    - List of key objects/entities in the image (bullet points).
    - Additional context (surroundings, mood, possible scenario, colors, or notable features).
    - Keep the response concise, structured, and clear, without any unnecessary details, may be within 200 words maximum.
  `,
};
