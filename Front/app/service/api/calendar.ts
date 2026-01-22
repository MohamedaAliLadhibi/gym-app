import apiClient from './client';
import { CalendarEvent, ApiResponse } from '../types';

export const calendarAPI = {
  // Get events
  getEvents: async (date?: string): Promise<CalendarEvent[]> => {
    const url = date ? `/calendar/events?date=${date}` : '/calendar/events';
    const response = await apiClient.get<CalendarEvent[]>(url);
    return response.data;
  },
  
  // Create event
  createEvent: async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const response = await apiClient.post<CalendarEvent>('/calendar/events', eventData);
    return response.data;
  },
  
  // Update event
  updateEvent: async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const response = await apiClient.put<CalendarEvent>(`/calendar/events/${id}`, eventData);
    return response.data;
  },
  
  // Delete event
  deleteEvent: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/calendar/events/${id}`
    );
    return response.data;
  },
  
  // Mark event as complete
  completeEvent: async (id: string): Promise<ApiResponse<{ completed: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ completed: boolean }>>(
      `/calendar/events/${id}/complete`
    );
    return response.data;
  },
  
  // Get monthly overview
  getMonthlyOverview: async (year: number, month: number): Promise<{
    date: string;
    hasWorkout: boolean;
    hasMeal: boolean;
    completed: boolean;
  }[]> => {
    const response = await apiClient.get<{
      date: string;
      hasWorkout: boolean;
      hasMeal: boolean;
      completed: boolean;
    }[]>(`/calendar/overview?year=${year}&month=${month}`);
    return response.data;
  },
  
  // Generate weekly schedule
  generateWeeklySchedule: async (): Promise<CalendarEvent[]> => {
    const response = await apiClient.post<CalendarEvent[]>('/calendar/generate-weekly');
    return response.data;
  },
};
