
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
      <div className="relative">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[80px] bg-black/10 dark:bg-white/10 border-none rounded-2xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-accent/50 outline-none transition-all duration-300"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit"
          size="sm"
          className="text-xs bg-accent hover:bg-accent/90 rounded-full px-4 py-2"
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
