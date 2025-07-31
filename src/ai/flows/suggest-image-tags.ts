'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for an image.
 *
 * The flow takes an image data URI as input and returns a list of suggested tags.
 *
 * @module src/ai/flows/suggest-image-tags
 *
 * @interface SuggestImageTagsInput - The input type for the suggestImageTags function.
 * @interface SuggestImageTagsOutput - The output type for the suggestImageTags function.
 * @function suggestImageTags - The function that triggers the tag suggestion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the suggestImageTags flow.
 */
const SuggestImageTagsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type SuggestImageTagsInput = z.infer<typeof SuggestImageTagsInputSchema>;

/**
 * Output schema for the suggestImageTags flow.
 */
const SuggestImageTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the image.'),
});

export type SuggestImageTagsOutput = z.infer<typeof SuggestImageTagsOutputSchema>;

/**
 * Flow function to suggest tags for a given image.
 * @param input - The input object containing the image data URI.
 * @returns A promise that resolves to an object containing an array of suggested tags.
 */
export async function suggestImageTags(input: SuggestImageTagsInput): Promise<SuggestImageTagsOutput> {
  return suggestImageTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImageTagsPrompt',
  input: {schema: SuggestImageTagsInputSchema},
  output: {schema: SuggestImageTagsOutputSchema},
  prompt: `You are an AI assistant that analyzes images and suggests relevant tags.

  Given the following image, suggest a list of tags that are relevant to the image.

  Image: {{media url=photoDataUri}}

  Return the tags as a JSON array of strings.
  `,
});

const suggestImageTagsFlow = ai.defineFlow(
  {
    name: 'suggestImageTagsFlow',
    inputSchema: SuggestImageTagsInputSchema,
    outputSchema: SuggestImageTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
