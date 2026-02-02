// app/(tabs)/workouts.tsx
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
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { workoutsAPI } from '../service/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette } from '../../constants/theme';

const { width } = Dimensions.get('window');
const COLORS = {
  primary: Palette.orange,
  secondary: Palette.orangeDark,
  dark: Palette.black,
  white: Palette.white,
  gray: Palette.gray500,
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'strength', name: 'Strength', icon: 'barbell' },
    { id: 'cardio', name: 'Cardio', icon: 'fitness' },
    { id: 'hiit', name: 'HIIT', icon: 'flash' },
    { id: 'flexibility', name: 'Flexibility', icon: 'body' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchWorkouts();
  }, [selectedCategory]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : undefined;
      const response = await workoutsAPI.getWorkouts(1, 50, filters);
      setWorkouts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkouts();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchWorkouts();
      return;
    }
    
    try {
      setLoading(true);
      const response = await workoutsAPI.searchWorkouts(searchQuery);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error searching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
onPress={() => router.push({
  pathname: '/(tabs)/workouts',
  params: { workoutId: item.id }
})}    >
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.workoutCardContent}
      >
        <View style={styles.workoutHeader}>
          <View>
            <Text style={styles.workoutTitle}>{item.title}</Text>
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                <Text style={styles.metaText}>{item.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={14} color={COLORS.gray} />
                <Text style={styles.metaText}>{item.caloriesBurned} cal</Text>
              </View>
            </View>
          </View>
          <View style={[styles.difficultyBadge, {
            backgroundColor: item.difficulty === 'beginner' ? '#10B98120' :
                           item.difficulty === 'intermediate' ? '#F59E0B20' : '#EF444420'
          }]}>
            <Text style={[styles.difficultyText, {
              color: item.difficulty === 'beginner' ? '#10B981' :
                     item.difficulty === 'intermediate' ? '#F59E0B' : '#EF4444'
            }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.workoutDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.exerciseCount}>
          <Ionicons name="list-outline" size={16} color={COLORS.primary} />
          <Text style={styles.exerciseCountText}>
            {item.exercises?.length || 0} exercises
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const totalPages = Math.max(1, Math.ceil(workouts.length / pageSize));
  const paginatedWorkouts = workouts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (direction: 'prev' | 'next') => {
    setCurrentPage((prev) => {
      if (direction === 'prev') return Math.max(1, prev - 1);
      return Math.min(totalPages, prev + 1);
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Workouts</Text>
            <Text style={styles.subtitle}>Choose your training plan</Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/create-workout')}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workouts..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <LinearGradient
                  colors={selectedCategory === category.id ? 
                    [COLORS.primary, COLORS.secondary] : 
                    ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.categoryContent}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={20} 
                    color={selectedCategory === category.id ? COLORS.white : COLORS.gray} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Plans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Plans</Text>
            <TouchableOpacity onPress={() => router.push('/workout-plans')}>
              <Text style={styles.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
          >
            {[
              {
                id: '1',
                title: 'Weight Loss',
                description: '4-week fat burning program',
                duration: '28 days',
                workouts: 16,
                color: '#10B981',
              },
              {
                id: '2',
                title: 'Muscle Gain',
                description: 'Build lean muscle mass',
                duration: '6 weeks',
                workouts: 24,
                color: '#3B82F6',
              },
              {
                id: '3',
                title: 'Beginner',
                description: 'Start your fitness journey',
                duration: '2 weeks',
                workouts: 8,
                color: '#7C3AED',
              },
            ].map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
onPress={() => console.log('Navigate to plan:', plan.id)}
              >
                <LinearGradient
                  colors={[plan.color, `${plan.color}CC`]}
                  style={styles.planCardContent}
                >
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                  <View style={styles.planDetails}>
                    <View style={styles.planDetail}>
                      <Ionicons name="calendar-outline" size={16} color={COLORS.white} />
                      <Text style={styles.planDetailText}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planDetail}>
                      <Ionicons name="barbell-outline" size={16} color={COLORS.white} />
                      <Text style={styles.planDetailText}>{plan.workouts} workouts</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.startPlanButton}>
                    <Text style={styles.startPlanText}>START PLAN</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Workouts</Text>
            <Text style={styles.workoutCount}>{workouts.length} workouts</Text>
          </View>

          {paginatedWorkouts.length > 0 ? (
            <FlatList
              data={paginatedWorkouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.workoutsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={64} color={COLORS.gray} />
              <Text style={styles.emptyStateTitle}>No workouts found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search' : 'Workouts will appear here'}
              </Text>
            </View>
          )}
          {workouts.length > 0 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                disabled={currentPage === 1}
                onPress={() => handlePageChange('prev')}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={currentPage === 1 ? COLORS.gray : COLORS.white}
                />
              </TouchableOpacity>

              <View style={styles.pageIndicators}>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  return (
                    <TouchableOpacity
                      key={page}
                      style={[
                        styles.pageDot,
                        isActive && styles.pageDotActive,
                      ]}
                      onPress={() => setCurrentPage(page)}
                    />
                  );
                })}
              </View>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                disabled={currentPage === totalPages}
                onPress={() => handlePageChange('next')}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={currentPage === totalPages ? COLORS.gray : COLORS.white}
                />
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
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
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
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryButtonActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  featuredScroll: {
    paddingHorizontal: 20,
  },
  planCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  planCardContent: {
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  planDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  planDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planDetailText: {
    fontSize: 14,
    color: COLORS.white,
  },
  startPlanButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  startPlanText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  workoutsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  workoutCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutCardContent: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseCountText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
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
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(148,163,184,0.6)',
  },
  pageDotActive: {
    width: 18,
    backgroundColor: COLORS.primary,
  },
});