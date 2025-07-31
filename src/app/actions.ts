'use server';

import { suggestImageTags } from '@/ai/flows/suggest-image-tags';
import type { SuggestImageTagsOutput } from '@/ai/flows/suggest-image-tags';

export async function handleSuggestTags(photoDataUri: string): Promise<SuggestImageTagsOutput> {
  // Basic validation for data URI
  if (!photoDataUri.startsWith('data:image/')) {
    console.error('Invalid data URI format');
    return { tags: [] };
  }

  try {
    const result = await suggestImageTags({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error suggesting image tags:', error);
    // Return a structured error or empty tags
    return { tags: [] };
  }
}
