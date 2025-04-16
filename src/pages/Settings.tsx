import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftIcon, MoonIcon, SunIcon, FileText } from "lucide-react";
import ImportExportDialog from "@/components/ImportExportDialog";
const Settings = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [exportWithImages, setExportWithImages] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    toast({
      title: `Theme changed to ${newTheme} mode`,
      description: `Application appearance has been updated.`
    });
  };
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all application data? This cannot be undone.")) {
      localStorage.clear();
      localStorage.setItem("eventscribe-auth", "true"); // Maintain login
      toast({
        title: "Data cleared",
        description: "All application data has been reset."
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  // Get events from localStorage for export
  const getEvents = () => {
    const savedEvents = localStorage.getItem("eventscribe-events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  };

  // Handle imported events
  const handleImportEvents = (importedEvents: any[]) => {
    localStorage.setItem("eventscribe-events", JSON.stringify(importedEvents));
    toast({
      title: "Events imported",
      description: `Successfully imported ${importedEvents.length} events.`
    });
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 notion-container">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="notion-container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Appearance</h2>
            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred appearance
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => handleThemeChange("light")} className="w-24">
                  <SunIcon className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => handleThemeChange("dark")} className="w-24">
                  <MoonIcon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>
          </div>

          {/* Export/Import Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Data Management</h2>
            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Export/Import Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Export or import your events data
                  </p>
                </div>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export/Import
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Clear all application data including events, preferences, and settings
                </p>
                <Button variant="destructive" onClick={handleClearData}>
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Preferences</h2>
            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for upcoming events
                  </p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Export with images</h3>
                  <p className="text-sm text-muted-foreground">
                    Include images when exporting event data
                  </p>
                </div>
                <Switch checked={exportWithImages} onCheckedChange={setExportWithImages} />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Auto-save</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes as you type
                  </p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">About teamspace</h2>
            <Separator />

            <div className="bg-card/30 p-4 rounded-md">
              <p className="text-sm">
                <strong>Version:</strong> 1.0.0
              </p>
              <p className="text-sm mt-1">
                <strong>Created with:</strong> React, TypeScript, Tailwind CSS
              </p>
              <p className="text-sm mt-1">
                <strong>Description:</strong> A simple event managing app inspired by Notion's UI and sleek design.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Import/Export Dialog */}
      <ImportExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} events={getEvents()} onImport={handleImportEvents} />
    </div>;
};
export default Settings;