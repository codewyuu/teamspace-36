import { TagColor } from "@/utils/tagColors";

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  notes: string;
  description: string;
  tags: string[];
  tagColors?: Record<string, TagColor>;
  collaborators: string[];
  comments: Comment[];
}
