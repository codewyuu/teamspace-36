
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import CreateEventDialog from "@/components/CreateEventDialog";
import { Event } from "@/types/event";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  
  const handleCreateEvent = (event: Event) => {
    try {
      // Get existing events from localStorage
      const savedEvents = localStorage.getItem("eventscribe-events");
      let allEvents = savedEvents ? JSON.parse(savedEvents) : [];
      
      // Add the new event
      allEvents.push(event);
      
      // Save back to localStorage
      localStorage.setItem("eventscribe-events", JSON.stringify(allEvents));
      
      toast({
        title: "Event created",
        description: "Your new event has been created successfully."
      });
      
      // Navigate to the event page
      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the event. Please try again."
      });
    }
  };
  
  // If dialog is closed without creating an event, go back to dashboard
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 notion-container">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Create New Event</h1>
          </div>
        </div>
      </header>
      
      <CreateEventDialog 
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default CreateEventPage;
