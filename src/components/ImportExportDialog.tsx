
import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DownloadIcon, UploadIcon, FileIcon, Table2Icon } from "lucide-react";
import { Event } from "@/types/event";
import { excelToEvents, downloadEventsAsExcel } from "@/utils/excelUtils";

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
  const [importOption, setImportOption] = useState<"json" | "excel">("json");
  const [exportOption, setExportOption] = useState<"json" | "excel">("json");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Reset import data when dialog is closed
  useEffect(() => {
    if (!open) {
      setImportData("");
      setImportOption("json");
      setExportOption("json");
    }
  }, [open]);

  const handleExport = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    if (exportOption === "json") {
      // Export as JSON
      const dataStr = JSON.stringify(events, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `teamspace-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } else {
      // Export as Excel
      const exportFileName = `teamspace-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      downloadEventsAsExcel(events, exportFileName);
    }
  };

  const handleImport = async (e: React.MouseEvent) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    if (importOption === "json") {
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
            notes: event.notes || "",
            description: event.description || ""
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
    }
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.name.endsWith('.xlsx')) {
        
        const importedEvents = await excelToEvents(file);
        
        onImport(importedEvents);
        onOpenChange(false);
        
        toast({
          title: "Excel import successful",
          description: `Imported ${importedEvents.length} events from Excel.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Import failed",
          description: "Please select a valid Excel (.xlsx) file."
        });
      }
    } catch (error) {
      console.error("Excel import error:", error);
      toast({
        variant: "destructive",
        title: "Excel import failed",
        description: "There was an error processing the Excel file."
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Generate an example template for users
  const exampleTemplate = JSON.stringify([
    {
      "id": "example-1",
      "name": "Example Event",
      "date": new Date().toISOString(),
      "notes": "This is an example event",
      "description": "Event description here",
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

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            <Tabs defaultValue="json" onValueChange={(value) => setImportOption(value as "json" | "excel")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="json">
                  <FileIcon className="h-4 w-4 mr-2" />
                  JSON
                </TabsTrigger>
                <TabsTrigger value="excel">
                  <Table2Icon className="h-4 w-4 mr-2" />
                  Excel
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="space-y-4 pt-4">
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
                    Import JSON Data
                  </Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="excel" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Upload an Excel file (.xlsx) containing your events data. The file should have columns matching event properties.
                </p>
                <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={triggerFileInput}>
                  <Input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx"
                    onChange={handleFileSelect}
                  />
                  <Table2Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to select an Excel file</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports .xlsx files</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">Expected columns:</p>
                  <p className="text-xs mt-1">id, name, date, notes, description, tags, collaborators</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your events to use them in other applications or as a backup.
            </p>
            {events.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No events to export
              </div>
            ) : (
              <>
                <Tabs defaultValue="json" onValueChange={(value) => setExportOption(value as "json" | "excel")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="json">
                      <FileIcon className="h-4 w-4 mr-2" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="excel">
                      <Table2Icon className="h-4 w-4 mr-2" />
                      Excel
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json" className="pt-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2 text-sm">Export summary:</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Total events: {events.length}</li>
                        <li>Format: JSON</li>
                        <li>Fields included: name, date, notes, tags, collaborators</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="excel" className="pt-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2 text-sm">Export summary:</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Total events: {events.length}</li>
                        <li>Format: Excel Spreadsheet (.xlsx)</li>
                        <li>Each event will be a row in the spreadsheet</li>
                        <li>Tags and collaborators will be comma-separated</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button onClick={handleExport} className="w-full">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export {events.length} Events as {exportOption === "json" ? "JSON" : "Excel"}
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
