
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
  description: string; // New field for general notes
  tags: string[];
  collaborators: string[];
  comments: Comment[]; // New field for collaborator comments
}
