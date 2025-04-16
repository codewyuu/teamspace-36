
import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ReplyIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment as CommentType } from "@/types/comment";
import { CommentBox } from "./CommentBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: string, content: string) => void;
  onVote: (id: string, increment: boolean) => void;
}

export function Comment({ comment, onReply, onVote }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVote(comment.id, true)}
            className="h-5 w-5 hover:bg-transparent p-0 text-muted-foreground hover:text-accent"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium">{comment.votes}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVote(comment.id, false)}
            className="h-5 w-5 hover:bg-transparent p-0 text-muted-foreground hover:text-accent"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm text-foreground/90">{comment.content}</p>
          
          <div className="flex items-center gap-4 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-accent"
            >
              <ReplyIcon className="h-3 w-3 mr-1" />
              Reply
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 text-muted-foreground hover:text-accent"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-6">
          <CommentBox onSubmit={handleReply} />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-6 space-y-4 border-l border-border/40 pl-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
