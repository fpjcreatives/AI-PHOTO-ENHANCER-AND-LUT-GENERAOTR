import { GoogleGenAI, Modality } from '@google/genai';

let ai: GoogleGenAI | null = null;
const imageModel = 'gemini-2.5-flash-image';

// Initializes the AI client. Caches it for subsequent calls.
function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }
  
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    // This should ideally be handled by the UI, but as a safeguard:
    throw new Error("Gemini API key not found. Please set it in the application settings.");
  }
  
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

/**
 * Sets the API key in local storage and resets the AI client instance.
 * @param apiKey The user's Google Gemini API key.
 */
export function setApiKey(apiKey: string) {
    localStorage.setItem('gemini_api_key', apiKey);
    ai = null; // Invalidate the old client instance so it's recreated with the new key
}

/**
 * Removes the API key from local storage.
 */
export function removeApiKey() {
    localStorage.removeItem('gemini_api_key');
    ai = null;
}

/**
 * Enhances an image using Gemini's "auto color" capability, with an optional color theme.
 * @param base64ImageData The base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @param baseColor An optional string describing a color theme or style to apply.
 * @param exportSize An optional string specifying the desired output size.
 * @param autoAlign An optional boolean to enable auto-alignment.
 * @param autoCrop An optional boolean to enable intelligent auto-cropping.
 * @returns A promise that resolves to the base64 encoded string of the enhanced image.
 */
export const enhanceImageWithAutoColor = async (
  base64ImageData: string, 
  mimeType: string, 
  baseColor?: string, 
  exportSize?: string,
  autoAlign?: boolean,
  autoCrop?: boolean
): Promise<string> => {
  const aiClient = getAiClient();
  let prompt = 'Apply auto color correction to this image to enhance its vibrancy, balance the colors, and improve the overall look. Make it look professional. Return only the edited image, with no other text or explanation.';

  if (baseColor && baseColor.trim().length > 0) {
    prompt += ` Additionally, apply a style inspired by these keywords: '${baseColor}'.`;
  }

  if (autoAlign) {
    prompt += ' Automatically align the image to straighten horizons and lines.';
  }

  if (autoCrop) {
    prompt += ' Intelligently crop the image to improve composition.';
  }

  const maintainAspectRatioInstruction = 'while strictly maintaining the original aspect ratio';

  switch (exportSize) {
    case '1024':
      prompt += ` Finally, resize the final image so its longest side is 1024 pixels.`;
      if (!autoCrop) prompt += ` ${maintainAspectRatioInstruction}.`;
      break;
    case '2048':
      prompt += ` Finally, resize the final image so its longest side is 2048 pixels.`;
      if (!autoCrop) prompt += ` ${maintainAspectRatioInstruction}.`;
      break;
    case '4k':
      prompt += ` Finally, resize the final image so its longest side is 3840 pixels.`;
      if (!autoCrop) prompt += ` ${maintainAspectRatioInstruction}.`;
      break;
    case 'original':
    default:
      if (!autoCrop && !autoAlign) {
         prompt += ' It is crucial that you do not crop, resize, or change the aspect ratio of the original image.';
      }
      break;
  }

  const response = await aiClient.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
    }
  }

  throw new Error('No enhanced image found in the API response.');
};

/**
 * Generates a color-graded HALD image by asking Gemini to apply a color transformation.
 * @param originalImage The base64 of the user's original image.
 * @param enhancedImage The base64 of the AI-enhanced image.
 * @param haldImage The base64 of the neutral HALD color grid.
 * @param mimeType The MIME type of the images.
 * @returns A promise that resolves to the base64 of the color-graded HALD image.
 */
export const generateLutImage = async (
    originalImage: string,
    enhancedImage: string,
    haldImage: string,
    mimeType: string,
): Promise<string> => {
    const aiClient = getAiClient();
    const prompt = `You are a professional color grading tool. I will provide three images: "Image A" (the original), "Image B" (the color-graded version), and "Image C" (a neutral color grid). Your task is to analyze the color transformation from Image A to Image B. Then, apply that exact same color transformation to Image C. Return only the transformed version of Image C, with no other text or explanation. The output must be a single image. It is crucial that the returned image has the exact same dimensions as Image C (512x512 pixels). Do not resize or alter its dimensions.`;

    const response = await aiClient.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { data: originalImage, mimeType } },
                { inlineData: { data: enhancedImage, mimeType } },
                { inlineData: { data: haldImage, mimeType: 'image/png' } }, // HALD is always PNG
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            return part.inlineData.data;
        }
    }

    throw new Error('No LUT image found in the API response.');
};
