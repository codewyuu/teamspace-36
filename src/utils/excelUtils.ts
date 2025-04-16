
import * as XLSX from 'xlsx';
import { Event } from '@/types/event';

/**
 * Converts Excel file to events array
 * @param file Excel file to parse
 * @returns Promise resolving to array of Event objects
 */
export const excelToEvents = async (file: File): Promise<Event[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume first sheet contains events
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform Excel data to Event objects
        const events: Event[] = jsonData.map((row: any) => ({
          id: row.id || String(Date.now() + Math.floor(Math.random() * 1000)),
          name: row.name || 'Untitled Event',
          date: new Date(row.date || Date.now()),
          notes: row.notes || '',
          description: row.description || '',
          tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
          collaborators: row.collaborators ? row.collaborators.split(',').map((collab: string) => collab.trim()) : [],
          comments: row.comments ? JSON.parse(row.comments) : []
        }));
        
        resolve(events);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Converts events array to Excel workbook
 * @param events Array of events to convert
 * @returns Excel workbook as a Blob
 */
export const eventsToExcel = (events: Event[]): Blob => {
  // Simplify events for Excel export
  const exportData = events.map((event) => ({
    id: event.id,
    name: event.name,
    date: event.date.toISOString(),
    notes: event.notes,
    description: event.description,
    tags: event.tags.join(', '),
    collaborators: event.collaborators.join(', '),
    comments: JSON.stringify(event.comments)
  }));

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Saves workbook as a downloadable Excel file
 * @param events Array of events to save
 * @param fileName Name of the file to download
 */
export const downloadEventsAsExcel = (events: Event[], fileName: string = 'events.xlsx'): void => {
  const blob = eventsToExcel(events);
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = fileName;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
