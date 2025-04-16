
import { Event } from '@/types/event';
import { excelToEvents, downloadEventsAsExcel } from '@/utils/excelUtils';

/**
 * Excel Service for managing event data with Excel sheets
 */
class ExcelService {
  /**
   * Loads events from localStorage
   * @returns Array of events
   */
  loadEvents(): Event[] {
    try {
      const savedEvents = localStorage.getItem('eventscribe-events');
      if (savedEvents) {
        return JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading events from storage:', error);
      return [];
    }
  }

  /**
   * Saves events to localStorage
   * @param events Array of events to save
   */
  saveEvents(events: Event[]): void {
    try {
      localStorage.setItem('eventscribe-events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to storage:', error);
      throw new Error('Failed to save events');
    }
  }

  /**
   * Imports events from Excel file
   * @param file Excel file to import
   * @returns Promise resolving to imported events
   */
  async importFromExcel(file: File): Promise<Event[]> {
    try {
      const events = await excelToEvents(file);
      this.saveEvents(events);
      return events;
    } catch (error) {
      console.error('Error importing from Excel:', error);
      throw new Error('Failed to import from Excel');
    }
  }

  /**
   * Exports events to Excel file and triggers download
   * @param events Events to export
   * @param fileName Name of the file to download
   */
  exportToExcel(events: Event[], fileName?: string): void {
    try {
      downloadEventsAsExcel(events, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export to Excel');
    }
  }

  /**
   * Adds a new event to storage
   * @param event Event to add
   * @returns Updated array of events
   */
  addEvent(event: Event): Event[] {
    const events = this.loadEvents();
    events.push(event);
    this.saveEvents(events);
    return events;
  }

  /**
   * Updates an existing event
   * @param updatedEvent Event with updated properties
   * @returns Updated array of events
   */
  updateEvent(updatedEvent: Event): Event[] {
    const events = this.loadEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    
    if (index !== -1) {
      events[index] = updatedEvent;
      this.saveEvents(events);
    }
    
    return events;
  }

  /**
   * Deletes an event by ID
   * @param eventId ID of the event to delete
   * @returns Updated array of events
   */
  deleteEvent(eventId: string): Event[] {
    const events = this.loadEvents().filter(e => e.id !== eventId);
    this.saveEvents(events);
    return events;
  }
}

// Export a singleton instance
export const excelService = new ExcelService();
