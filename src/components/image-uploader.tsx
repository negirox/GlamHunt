'use client';

import { useState } from 'react';
import Image from 'next/image';
import { handleSuggestTags } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Tag, Wand2 } from 'lucide-react';

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSuggestedTags([]);

      const reader = new FileReader();
      reader.onloadstart = () => setIsLoading(true);
      reader.onloadend = async (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewUrl(dataUrl);
        try {
          const { tags } = await handleSuggestTags(dataUrl);
          setSuggestedTags(tags);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not suggest tags for the image.',
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleAddCustomTag = () => {
    if (customTag && !suggestedTags.includes(customTag)) {
      setSuggestedTags([...suggestedTags, customTag]);
    }
    setCustomTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSuggestedTags(suggestedTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleUpload = () => {
    if (!file) return;
    toast({
      title: 'Image Uploaded!',
      description: `${file.name} has been added to your portfolio with ${suggestedTags.length} tags.`,
    });
    // Reset state
    setFile(null);
    setPreviewUrl(null);
    setSuggestedTags([]);
    setCustomTag('');
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="image-upload" className="cursor-pointer border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <span className="font-semibold text-primary">Click to upload</span>
          <span className="text-sm text-muted-foreground">or drag and drop</span>
        </Label>
        <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Analyzing your image...</p>
        </div>
      )}

      {previewUrl && !isLoading && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image src={previewUrl} alt="Image preview" layout="fill" objectFit="cover" />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-secondary"/> AI Suggested Tags</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-base py-1 pl-3 pr-2">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 rounded-full hover:bg-white/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {suggestedTags.length === 0 && <p className="text-sm text-muted-foreground">No tags suggested. Add your own!</p>}
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="custom-tag" className="flex items-center gap-2"><Tag className="h-4 w-4" /> Custom Tag</Label>
             <div className="flex gap-2">
              <Input 
                id="custom-tag" 
                value={customTag} 
                onChange={e => setCustomTag(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                placeholder="e.g., editorial, studio"
              />
              <Button type="button" variant="outline" onClick={handleAddCustomTag}>Add</Button>
             </div>
          </div>
          
          <Button onClick={handleUpload} disabled={!file} className="w-full">
            <Upload className="mr-2 h-4 w-4" /> Upload to Portfolio
          </Button>
        </div>
      )}
    </div>
  );
}
