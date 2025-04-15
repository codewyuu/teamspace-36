
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { Event } from "@/types/event";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  onImport: (events: Event[]) => void;
}

const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  open,
  onOpenChange,
  events,
  onImport,
}) => {
  const [importData, setImportData] = useState("");
  const { toast } = useToast();

  // Reset import data when dialog is closed
  useEffect(() => {
    if (!open) {
      setImportData("");
    }
  }, [open]);

  const handleExport = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Export as JSON
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `teamspace-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const parsedData = JSON.parse(importData);
      
      // Basic validation
      if (!Array.isArray(parsedData)) {
        throw new Error("Imported data must be an array of events");
      }
      
      // Parse dates and validate structure
      const processedEvents = parsedData.map((event: any) => {
        if (!event.id || !event.name || !event.date) {
          throw new Error("Invalid event format detected");
        }
        
        return {
          ...event,
          date: new Date(event.date),
          // Ensure these fields exist
          tags: Array.isArray(event.tags) ? event.tags : [],
          collaborators: Array.isArray(event.collaborators) ? event.collaborators : [],
          notes: event.notes || ""
        };
      });
      
      onImport(processedEvents);
      onOpenChange(false);
      setImportData("");
      
      toast({
        title: "Import successful",
        description: `Imported ${processedEvents.length} events successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: "The data format is invalid. Please check your JSON structure."
      });
    }
  };
  
  // Generate an example template for users
  const exampleTemplate = JSON.stringify([
    {
      "id": "example-1",
      "name": "Example Event",
      "date": new Date().toISOString(),
      "notes": "This is an example event",
      "tags": ["example", "template"],
      "collaborators": ["John Doe", "Jane Smith"]
    }
  ], null, 2);

  // Handle dialog close with cleanup
  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Ensure state is reset when dialog closes
      setImportData("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Import / Export Events</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste your JSON data below to import events. Make sure it follows the correct format.
            </p>
            <Textarea 
              placeholder="Paste JSON data here..." 
              className="h-56 font-mono text-sm"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">Example format:</p>
              <pre className="bg-muted p-2 rounded-md mt-1 overflow-auto text-xs">
                {exampleTemplate}
              </pre>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleImport} 
                disabled={!importData.trim()}
                className="w-full"
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your events as a JSON file that you can later import back or use in other applications.
            </p>
            {events.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No events to export
              </div>
            ) : (
              <>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 text-sm">Export summary:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Total events: {events.length}</li>
                    <li>Format: JSON</li>
                    <li>Fields included: name, date, notes, tags, collaborators</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button onClick={handleExport} className="w-full">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export {events.length} Events
                  </Button>
                </DialogFooter>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;
