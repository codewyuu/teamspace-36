import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeftIcon,
  CalendarIcon,
  FileText,
  MessageSquare,
  MessageCircle,
  PlusIcon,
  SaveIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Event, Comment } from "@/types/event";
import { cn } from "@/lib/utils";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [collaborator, setCollaborator] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchEvent = () => {
      setIsLoading(true);
      try {
        // Load events from localStorage
        const savedEvents = localStorage.getItem("eventscribe-events");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents).map((e: any) => ({
            ...e,
            date: new Date(e.date)
          }));
          
          const foundEvent = parsedEvents.find((e: Event) => e.id === id);
          if (foundEvent) {
            setEvent(foundEvent);
            // Populate form fields
            setName(foundEvent.name);
            setDate(new Date(foundEvent.date));
            setNotes(foundEvent.notes);
            setTags(foundEvent.tags);
            setCollaborators(foundEvent.collaborators);
          } else {
            // Event not found
            toast({
              variant: "destructive",
              title: "Event not found",
              description: "The requested event could not be found."
            });
            navigate("/");
          }
        } else {
          // No events in storage
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, navigate, toast]);
  
  const saveEvent = () => {
    if (!name || !date) return;
    
    try {
      // Get all events
      const savedEvents = localStorage.getItem("eventscribe-events");
      let allEvents = savedEvents ? JSON.parse(savedEvents).map((e: any) => ({
        ...e,
        date: new Date(e.date)
      })) : [];
      
      // Update the event
      const updatedEvent: Event = {
        id: id!,
        name,
        date,
        notes,
        description: event?.description || "",
        tags,
        collaborators,
        comments: event?.comments || []
      };
      
      // Replace the event in the array
      const eventIndex = allEvents.findIndex((e: Event) => e.id === id);
      if (eventIndex !== -1) {
        allEvents[eventIndex] = updatedEvent;
        localStorage.setItem("eventscribe-events", JSON.stringify(allEvents));
        
        setEvent(updatedEvent);
        setIsEditMode(false);
        
        toast({
          title: "Event updated",
          description: "Your changes have been saved."
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event changes."
      });
    }
  };
  
  const deleteEvent = () => {
    try {
      // Get all events
      const savedEvents = localStorage.getItem("eventscribe-events");
      if (savedEvents) {
        const allEvents = JSON.parse(savedEvents);
        
        // Filter out the event to delete
        const filteredEvents = allEvents.filter((e: Event) => e.id !== id);
        localStorage.setItem("eventscribe-events", JSON.stringify(filteredEvents));
        
        toast({
          title: "Event deleted",
          description: "The event has been permanently removed."
        });
        
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the event."
      });
    }
  };
  
  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const addCollaborator = () => {
    if (collaborator.trim() && !collaborators.includes(collaborator.trim())) {
      setCollaborators([...collaborators, collaborator.trim()]);
      setCollaborator("");
    }
  };
  
  const removeCollaborator = (collabToRemove: string) => {
    setCollaborators(collaborators.filter(c => c !== collabToRemove));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading event details...</div>
      </div>
    );
  }
  
  if (!event) return null;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 notion-container">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            {!isEditMode ? (
              <h1 className="text-xl font-semibold truncate">{event.name}</h1>
            ) : (
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold max-w-md"
                placeholder="Event name"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEvent} disabled={!name || !date}>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="notion-container py-8">
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Date section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Date:</span>
            </div>
            
            {!isEditMode ? (
              <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
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
            )}
          </div>
          
          {/* Tags section */}
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <TagIcon className="h-5 w-5 mr-2" />
              <span>Tags:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    {isEditMode && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">No tags</span>
              )}
              
              {isEditMode && (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Add tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="w-32 h-8 text-sm"
                  />
                  <Button size="sm" variant="secondary" onClick={addTag}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Collaborators section */}
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <UsersIcon className="h-5 w-5 mr-2" />
              <span>Collaborators:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {collaborators.length > 0 ? (
                collaborators.map(collab => (
                  <div key={collab} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center">
                    {collab}
                    {isEditMode && (
                      <button
                        onClick={() => removeCollaborator(collab)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">No collaborators</span>
              )}
              
              {isEditMode && (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Add collaborator"
                    value={collaborator}
                    onChange={(e) => setCollaborator(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCollaborator();
                      }
                    }}
                    className="w-40 h-8 text-sm"
                  />
                  <Button size="sm" variant="secondary" onClick={addCollaborator}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Notes section */}
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Notes:</span>
            </div>
            
            {!isEditMode ? (
              <div className="p-4 bg-card/30 rounded-lg min-h-[200px] whitespace-pre-wrap">
                {event.notes || <span className="text-muted-foreground italic">No notes</span>}
              </div>
            ) : (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the event"
                className="min-h-[200px]"
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{event.name}" and remove all data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventPage;
