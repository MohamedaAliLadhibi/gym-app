// app/(tabs)/calendar.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { calendarAPI } from '../service/api';

const COLORS = {
  primary: '#7C3AED',
  secondary: '#3B82F6',
  dark: '#0F172A',
  white: '#FFFFFF',
  gray: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('day'); // 'day', 'week', 'month'

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, view]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await calendarAPI.getEvents(dateStr);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'workout': return COLORS.primary;
      case 'meal': return COLORS.success;
      case 'measurement': return COLORS.secondary;
      case 'reminder': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'workout': return 'barbell';
      case 'meal': return 'restaurant';
      case 'measurement': return 'scale';
      case 'reminder': return 'notifications';
      default: return 'calendar';
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/event-detail/${item.id}`)}
    >
      <View style={styles.eventCardContent}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventIcon, { backgroundColor: getEventColor(item.type) }]}>
            <Ionicons name={getEventIcon(item.type)} size={20} color={COLORS.white} />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>
              {new Date(item.startTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} - {new Date(item.endTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          {item.completed ? (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          ) : (
            <TouchableOpacity 
              style={styles.markCompleteButton}
              onPress={() => handleMarkComplete(item.id)}
            >
              <Text style={styles.markCompleteText}>Mark Done</Text>
            </TouchableOpacity>
          )}
        </View>
        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleMarkComplete = async (eventId) => {
    try {
      await calendarAPI.completeEvent(eventId);
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error marking event complete:', error);
    }
  };

  const handleAddEvent = () => {
    router.push('/add-event');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.subtitle}>{formatDate(selectedDate)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddEvent}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* View Selector */}
        <View style={styles.viewSelector}>
          {['day', 'week', 'month'].map((viewType) => (
            <TouchableOpacity
              key={viewType}
              style={[
                styles.viewButton,
                view === viewType && styles.viewButtonActive
              ]}
              onPress={() => setView(viewType)}
            >
              <Text style={[
                styles.viewButtonText,
                view === viewType && styles.viewButtonTextActive
              ]}>
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              const newDate = new Date(selectedDate);
              if (view === 'day') newDate.setDate(newDate.getDate() - 1);
              if (view === 'week') newDate.setDate(newDate.getDate() - 7);
              if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.todayButton}
            onPress={() => setSelectedDate(new Date())}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              const newDate = new Date(selectedDate);
              if (view === 'day') newDate.setDate(newDate.getDate() + 1);
              if (view === 'week') newDate.setDate(newDate.getDate() + 7);
              if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
          >
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Calendar Overview */}
        {view === 'month' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Overview</Text>
            <View style={styles.calendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <View key={index} style={styles.calendarHeaderCell}>
                  <Text style={styles.calendarHeaderText}>{day}</Text>
                </View>
              ))}
              {/* Calendar days would go here */}
            </View>
          </View>
        )}

        {/* Today's Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {view === 'day' ? "Today's Schedule" : 
               view === 'week' ? "This Week" : "This Month"}
            </Text>
            <Text style={styles.eventCount}>
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </Text>
          </View>

          {events.length > 0 ? (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.eventsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={COLORS.gray} />
              <Text style={styles.emptyStateTitle}>No events scheduled</Text>
              <Text style={styles.emptyStateText}>
                {view === 'day' ? 'No events for today' :
                 view === 'week' ? 'No events this week' :
                 'No events this month'}
              </Text>
              <TouchableOpacity
                style={styles.addEventButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.addEventButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Upcoming */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <View style={styles.upcomingList}>
            {[
              { type: 'workout', title: 'Morning Workout', time: 'Tomorrow, 7:00 AM' },
              { type: 'meal', title: 'Meal Prep', time: 'Sunday, 2:00 PM' },
              { type: 'measurement', title: 'Weekly Weigh-in', time: 'Monday, 8:00 AM' },
            ].map((item, index) => (
              <View key={index} style={styles.upcomingItem}>
                <View style={[styles.upcomingIcon, { backgroundColor: getEventColor(item.type) }]}>
                  <Ionicons name={getEventIcon(item.type)} size={16} color={COLORS.white} />
                </View>
                <View style={styles.upcomingInfo}>
                  <Text style={styles.upcomingTitle}>{item.title}</Text>
                  <Text style={styles.upcomingTime}>{item.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Schedule</Text>
          <View style={styles.quickActions}>
            {[
              { title: 'Schedule Workout', icon: 'barbell', color: COLORS.primary },
              { title: 'Plan Meals', icon: 'restaurant', color: COLORS.success },
              { title: 'Set Reminder', icon: 'notifications', color: COLORS.warning },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => router.push(`/add-event?type=${action.title.toLowerCase()}`)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={20} color={COLORS.white} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  viewButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  todayButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  eventCount: {
    fontSize: 14,
    color: COLORS.gray,
    paddingHorizontal: 20,
  },
  calendarGrid: {
    paddingHorizontal: 20,
  },
  calendarHeaderCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeaderText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
  markCompleteButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markCompleteText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addEventButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  upcomingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  upcomingTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
});