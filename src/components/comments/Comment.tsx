
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
      <div className="flex gap-4 p-4 rounded-lg bg-card/30 border border-border">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVote(comment.id, true)}
            className="h-6 w-6"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{comment.votes}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVote(comment.id, false)}
            className="h-6 w-6"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              <ReplyIcon className="h-4 w-4 mr-1" />
              Reply
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
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
        <div className="ml-12">
          <CommentBox onSubmit={handleReply} />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 border-border pl-4">
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
