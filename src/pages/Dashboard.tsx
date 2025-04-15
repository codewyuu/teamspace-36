
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusIcon, 
  SearchIcon, 
  CalendarIcon, 
  Settings2Icon,
  MoonIcon,
  SunIcon,
  LogOutIcon,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImportExportDialog from "@/components/ImportExportDialog";

// Define Event type locally for now
interface Event {
  id: string;
  name: string;
  date: Date;
  notes: string;
  tags: string[];
  collaborators: string[];
}

// Sample data
const initialEvents: Event[] = [
  {
    id: "1",
    name: "Annual Conference",
    date: new Date("2024-05-15"),
    notes: "Main conference for the year, need to prepare presentation materials",
    tags: ["conference", "important"],
    collaborators: ["Alex Smith", "Jamie Lee"],
  },
  {
    id: "2",
    name: "Team Building",
    date: new Date("2024-04-30"),
    notes: "Outdoor activities planned, check weather forecast",
    tags: ["team", "outdoor"],
    collaborators: ["Jamie Lee", "Taylor Wong"],
  }
];

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  useEffect(() => {
    // Load events from localStorage if available
    const savedEvents = localStorage.getItem("eventscribe-events");
    if (savedEvents) {
      try {
        // Parse dates correctly from JSON
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      } catch (e) {
        console.error("Error parsing events from localStorage", e);
        setEvents(initialEvents);
      }
    } else {
      setEvents(initialEvents);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("eventscribe-events", JSON.stringify(events));
    }
  }, [events]);

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.notes.toLowerCase().includes(searchLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      event.collaborators.some(collab => collab.toLowerCase().includes(searchLower))
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("eventscribe-auth");
    window.location.href = "/login";
  };

  // Get events from localStorage for export
  const getEvents = () => {
    return events;
  };

  // Handle imported events
  const handleImportEvents = (importedEvents: any[]) => {
    setEvents(importedEvents);
    localStorage.setItem("eventscribe-events", JSON.stringify(importedEvents));
    toast({
      title: "Events imported",
      description: `Successfully imported ${importedEvents.length} events.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 notion-container">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">EventScribe</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {theme === 'dark' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <SunIcon className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <MoonIcon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings2Icon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsExportDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" /> Export/Import
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings2Icon className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile search */}
      <div className="md:hidden p-4 notion-container">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="notion-container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Events</h2>
          <Button asChild>
            <Link to="/event/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>

        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => new Date(e.date) > new Date()).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Collaborators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.from(new Set(events.flatMap(e => e.collaborators))).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events table */}
        <div className="bg-card/30 p-4 rounded-md border">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Event Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Collaborators</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-border">
                  <td className="px-4 py-3">{event.name}</td>
                  <td className="px-4 py-3">{event.date.toLocaleDateString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag) => (
                        <span key={tag} className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{event.collaborators.join(", ")}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/event/${event.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </div>
      </main>

      {/* Import/Export Dialog */}
      <ImportExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        events={getEvents()}
        onImport={handleImportEvents}
      />
    </div>
  );
};

export default Dashboard;
