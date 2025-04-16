
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Event } from "@/types/event";
import { cn } from "@/lib/utils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: Event) => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateEvent
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [collaborator, setCollaborator] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const handleCreateEvent = () => {
    if (!name || !date) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      name: name.trim(),
      date: date,
      notes: notes.trim(),
      description: description.trim(),
      tags,
      collaborators,
      comments: []
    };

    onCreateEvent(newEvent);
    resetForm();
  };

  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addCollaborator = () => {
    if (collaborator.trim() && !collaborators.includes(collaborator.trim())) {
      setCollaborators([...collaborators, collaborator.trim()]);
      setCollaborator("");
    }
  };

  const removeCollaborator = (collabToRemove: string) => {
    setCollaborators(collaborators.filter((c) => c !== collabToRemove));
  };

  const resetForm = () => {
    setName("");
    setDate(new Date());
    setNotes("");
    setDescription("");
    setTag("");
    setTags([]);
    setCollaborator("");
    setCollaborators([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a general description of the event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about the event"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                placeholder="Add tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="icon" variant="secondary">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <Badge key={t} removeTag={() => removeTag(t)}>
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collaborators">Collaborators</Label>
            <div className="flex space-x-2">
              <Input
                id="collaborators"
                placeholder="Add collaborator"
                value={collaborator}
                onChange={(e) => setCollaborator(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCollaborator();
                  }
                }}
              />
              <Button type="button" onClick={addCollaborator} size="icon" variant="secondary">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            {collaborators.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {collaborators.map((c) => (
                  <Badge key={c} removeTag={() => removeCollaborator(c)}>
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateEvent} disabled={!name || !date}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Custom Badge component for tags and collaborators
interface BadgeProps {
  children: React.ReactNode;
  removeTag: () => void;
}

const Badge: React.FC<BadgeProps> = ({ children, removeTag }) => {
  return (
    <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center">
      <span>{children}</span>
      <button 
        onClick={removeTag}
        className="ml-1 text-muted-foreground hover:text-foreground"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default CreateEventDialog;
