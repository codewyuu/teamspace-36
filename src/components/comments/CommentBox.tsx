
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function CommentBox({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] bg-background resize-none border-border/50 focus-visible:ring-accent"
      />
      <div className="flex justify-end">
        <Button 
          type="submit"
          size="sm"
          className="text-xs bg-accent hover:bg-accent/90"
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
