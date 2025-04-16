
import React, { useState } from 'react';
import { Comment as CommentType } from "@/types/comment";
import { Comment } from "./Comment";
import { CommentBox } from "./CommentBox";
import { v4 as uuidv4 } from 'uuid';

export function CommentSection() {
  const [comments, setComments] = useState<CommentType[]>([]);

  const handleNewComment = (content: string) => {
    const newComment: CommentType = {
      id: uuidv4(),
      author: "Current User", // In a real app, this would come from auth
      content,
      timestamp: new Date(),
      replies: [],
      votes: 0
    };
    setComments([newComment, ...comments]);
  };

  const handleReply = (parentId: string, content: string) => {
    const addReply = (comments: CommentType[]): CommentType[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              {
                id: uuidv4(),
                author: "Current User",
                content,
                timestamp: new Date(),
                replies: [],
                votes: 0
              },
              ...comment.replies
            ]
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReply(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(addReply(comments));
  };

  const handleVote = (id: string, increment: boolean) => {
    const updateVotes = (comments: CommentType[]): CommentType[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            votes: comment.votes + (increment ? 1 : -1)
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateVotes(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(updateVotes(comments));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="mb-8">
        <CommentBox onSubmit={handleNewComment} />
      </div>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}
