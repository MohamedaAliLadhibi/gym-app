// app/(tabs)/exercise.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { workoutsAPI } from '../service/api';

const { width } = Dimensions.get('window');
const COLORS = {
  primary: '#7C3AED',
  secondary: '#3B82F6',
  dark: '#0F172A',
  white: '#FFFFFF',
  gray: '#64748B',
};

export default function ExerciseScreen() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'chest', name: 'Chest', icon: 'body' },
    { id: 'back', name: 'Back', icon: 'body' },
    { id: 'legs', name: 'Legs', icon: 'body' },
    { id: 'shoulders', name: 'Shoulders', icon: 'body' },
    { id: 'arms', name: 'Arms', icon: 'body' },
    { id: 'core', name: 'Core', icon: 'body' },
  ]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedMuscleGroup, searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await workoutsAPI.getExercises();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(exercise =>
        exercise.muscleGroup?.includes(selectedMuscleGroup)
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => router.push(`/exercise-detail/${item.id}`)}
    >
      <View style={styles.exerciseCardContent}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseImage}>
            <Ionicons name="fitness" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseMuscle} numberOfLines={1}>
              {item.muscleGroup?.join(', ')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </View>
        <Text style={styles.exerciseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.exerciseMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="repeat" size={16} color={COLORS.gray} />
            <Text style={styles.metaText}>
              {item.sets} sets × {item.reps} reps
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.gray} />
            <Text style={styles.metaText}>{item.restTime}s rest</Text>
          </View>
        </View>
        {item.equipment && item.equipment.length > 0 && (
          <View style={styles.equipmentContainer}>
            <Text style={styles.equipmentLabel}>Equipment:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.equipment.map((eq, index) => (
                <View key={index} style={styles.equipmentTag}>
                  <Text style={styles.equipmentText}>{eq}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.title}>Exercise Library</Text>
            <Text style={styles.subtitle}>
              {filteredExercises.length} exercises available
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => router.push('/favorites')}
          >
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Muscle Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Groups</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.muscleGroupsScroll}
          >
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.muscleGroupButton,
                  selectedMuscleGroup === group.id && styles.muscleGroupButtonActive
                ]}
                onPress={() => setSelectedMuscleGroup(group.id)}
              >
                <View style={[
                  styles.muscleGroupIcon,
                  selectedMuscleGroup === group.id && styles.muscleGroupIconActive
                ]}>
                  <Ionicons 
                    name={group.icon} 
                    size={20} 
                    color={selectedMuscleGroup === group.id ? COLORS.white : COLORS.gray} 
                  />
                </View>
                <Text style={[
                  styles.muscleGroupText,
                  selectedMuscleGroup === group.id && styles.muscleGroupTextActive
                ]}>
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Exercises</Text>
            <TouchableOpacity onPress={() => router.push('/featured-exercises')}>
              <Text style={styles.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
          >
            {filteredExercises.slice(0, 5).map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/exercise-detail/${exercise.id}`)}
              >
                <View style={styles.featuredCardContent}>
                  <View style={styles.featuredImage}>
                    <Ionicons name="fitness" size={40} color={COLORS.primary} />
                  </View>
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.featuredCategory} numberOfLines={1}>
                    {exercise.muscleGroup?.[0] || 'Full Body'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Exercises</Text>
            <Text style={styles.exerciseCount}>
              Showing {filteredExercises.length} of {exercises.length}
            </Text>
          </View>

          {filteredExercises.length > 0 ? (
            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.exercisesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={64} color={COLORS.gray} />
              <Text style={styles.emptyStateTitle}>No exercises found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search' : 'No exercises in this category'}
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSelectedMuscleGroup('all');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
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
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
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
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  muscleGroupsScroll: {
    paddingHorizontal: 20,
  },
  muscleGroupButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  muscleGroupButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  muscleGroupIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  muscleGroupIconActive: {
    backgroundColor: COLORS.primary,
  },
  muscleGroupText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  muscleGroupTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  featuredScroll: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 120,
    marginRight: 12,
  },
  featuredCardContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  featuredImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  exerciseCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  exercisesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseCardContent: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: COLORS.primary,
  },
  exerciseDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipmentLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  equipmentTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  equipmentText: {
    fontSize: 12,
    color: COLORS.white,
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
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});