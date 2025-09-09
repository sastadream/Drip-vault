'use client';

import { useState } from 'react';
import { generateFileName } from '@/ai/flows/intelligent-file-name-generation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Copy } from 'lucide-react';

export function FileNameGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const { toast } = useToast();

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSuggestion('');
    const formData = new FormData(event.currentTarget);
    const content = formData.get('content') as string;

    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Content is empty',
        description: 'Please paste some content from your file to generate a name.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateFileName({
        fileContent: content,
        fileType: 'text', // Assuming text content for now
      });
      setSuggestion(result.suggestedFileName);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a file name. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Name Generator</CardTitle>
        <CardDescription>
          Paste content from your file to get a smart name suggestion.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleGenerate}>
        <CardContent>
          <div className="grid w-full gap-2">
            <Label htmlFor="content">File Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Paste a paragraph or two from your document here..."
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-stretch">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest Name
              </>
            )}
          </Button>
          {suggestion && (
            <div className="flex items-center justify-between rounded-md border bg-muted p-3 text-sm">
              <span className="font-semibold text-muted-foreground truncate pr-2">{suggestion}</span>
              <Button type="button" size="icon" variant="ghost" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
