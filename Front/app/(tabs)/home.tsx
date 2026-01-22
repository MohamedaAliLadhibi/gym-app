// app/(tabs)/home.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { workoutsAPI, nutritionAPI } from '../service/api';
import { useAuth } from '@/app/context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#7C3AED',
  secondary: '#3B82F6',
  accent: '#EC4899',
  dark: '#0F172A',
  light: '#F8FAFC',
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export default function HomeScreen() {
  const { user, updateProfile } = useAuth();
  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured workouts
      const workouts = await workoutsAPI.getFeaturedWorkouts();
      setFeaturedWorkouts(workouts);
      
      // Fetch daily nutrition
      const today = new Date().toISOString().split('T')[0];
      const nutrition = await nutritionAPI.getDailyNutrition(today);
      setDailyNutrition(nutrition);
      
      // Fetch workout history (last 5 workouts)
      const history = await workoutsAPI.getWorkoutHistory(1, 5);
      setWorkoutHistory(history.data || []);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleStartWorkout = (workoutId) => {
    router.push(`/workout/${workoutId}`);
  };

  const handleViewNutrition = () => {
    router.push('/(tabs)/nutrition');
  };

  const handleViewProfile = () => {
    router.push('/(tabs)/profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your fitness data...</Text>
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
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={handleViewProfile}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'Fitness Warrior'}!</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.primary, '#8B5CF6']}
              style={styles.statGradient}
            >
              <Ionicons name="flame" size={24} color={COLORS.white} />
              <Text style={styles.statNumber}>
                {dailyNutrition?.totalCalories || 0}
              </Text>
              <Text style={styles.statLabel}>Calories Today</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.secondary, '#60A5FA']}
              style={styles.statGradient}
            >
              <Ionicons name="barbell" size={24} color={COLORS.white} />
              <Text style={styles.statNumber}>
                {workoutHistory.length || 0}
              </Text>
              <Text style={styles.statLabel}>Workouts This Week</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Today's Workout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/workouts')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          {featuredWorkouts.length > 0 ? (
            <Animated.View
              style={[
                styles.workoutCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUpAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={[COLORS.dark, '#1E293B']}
                style={styles.workoutCardContent}
              >
                <View style={styles.workoutHeader}>
                  <View>
                    <Text style={styles.workoutTitle}>
                      {featuredWorkouts[0]?.title}
                    </Text>
                    <View style={styles.workoutMeta}>
                      <View style={styles.workoutMetaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.workoutMetaText}>
                          {featuredWorkouts[0]?.duration} min
                        </Text>
                      </View>
                      <View style={styles.workoutMetaItem}>
                        <Ionicons name="flame-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.workoutMetaText}>
                          {featuredWorkouts[0]?.caloriesBurned} cal
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.workoutBadge}>
                    <Text style={styles.workoutBadgeText}>
                      {featuredWorkouts[0]?.difficulty?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.workoutDescription}>
                  {featuredWorkouts[0]?.description}
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartWorkout(featuredWorkouts[0]?.id)}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.startButtonGradient}
                  >
                    <Ionicons name="play" size={20} color={COLORS.white} />
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="barbell-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No workouts scheduled for today</Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push('/(tabs)/workouts')}
              >
                <Text style={styles.browseButtonText}>Browse Workouts</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Nutrition Tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nutrition Today</Text>
            <TouchableOpacity onPress={handleViewNutrition}>
              <Text style={styles.seeAllText}>Details →</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.nutritionCard,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <View style={styles.nutritionHeader}>
              <View>
                <Text style={styles.nutritionTitle}>Macros Progress</Text>
                <Text style={styles.nutritionSubtitle}>
                  {dailyNutrition ? `${Math.round((dailyNutrition.totalCalories / dailyNutrition.goals.calories) * 100)}% of goal` : 'Track your meals'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.addMealButton}
                onPress={() => router.push('/log-meal')}
              >
                <Ionicons name="add" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {dailyNutrition ? (
              <View style={styles.macrosContainer}>
                {[
                  {
                    label: 'Protein',
                    value: dailyNutrition.totalProtein,
                    goal: dailyNutrition.goals.protein,
                    color: COLORS.primary,
                    unit: 'g'
                  },
                  {
                    label: 'Carbs',
                    value: dailyNutrition.totalCarbs,
                    goal: dailyNutrition.goals.carbs,
                    color: COLORS.secondary,
                    unit: 'g'
                  },
                  {
                    label: 'Fat',
                    value: dailyNutrition.totalFat,
                    goal: dailyNutrition.goals.fat,
                    color: COLORS.accent,
                    unit: 'g'
                  },
                ].map((macro, index) => (
                  <View key={index} style={styles.macroItem}>
                    <View style={styles.macroHeader}>
                      <View style={[styles.macroDot, { backgroundColor: macro.color }]} />
                      <Text style={styles.macroLabel}>{macro.label}</Text>
                      <Text style={styles.macroValue}>
                        {macro.value}/{macro.goal}{macro.unit}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            width: `${Math.min(100, (macro.value / macro.goal) * 100)}%`,
                            backgroundColor: macro.color 
                          }
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyNutrition}>
                <Ionicons name="restaurant-outline" size={40} color={COLORS.gray} />
                <Text style={styles.emptyNutritionText}>
                  No meals logged today
                </Text>
                <TouchableOpacity
                  style={styles.logMealButton}
                  onPress={() => router.push('/log-meal')}
                >
                  <Text style={styles.logMealButtonText}>Log Your First Meal</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/activity')}>
              <Text style={styles.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {workoutHistory.length > 0 ? (
            <View style={styles.activityList}>
              {workoutHistory.slice(0, 3).map((activity, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.activityItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateX: slideUpAnim.interpolate({
                            inputRange: [0, 30],
                            outputRange: [0, 10 * index]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <View style={styles.activityIcon}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{activity.workout?.title}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.completedAt).toLocaleDateString()} • {activity.duration} min
                    </Text>
                  </View>
                  <Text style={styles.activityCalories}>
                    {activity.caloriesBurned} cal
                  </Text>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="time-outline" size={40} color={COLORS.gray} />
              <Text style={styles.emptyActivityText}>
                No recent workouts completed
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              {
                title: 'Start Workout',
                icon: 'play-circle',
                color: COLORS.primary,
                onPress: () => router.push('/(tabs)/workouts'),
              },
              {
                title: 'Log Meal',
                icon: 'restaurant',
                color: COLORS.success,
                onPress: () => router.push('/log-meal'),
              },
              {
                title: 'Track Weight',
                icon: 'scale',
                color: COLORS.warning,
                onPress: () => router.push('/track-weight'),
              },
              {
                title: 'Schedule',
                icon: 'calendar',
                color: COLORS.secondary,
                onPress: () => router.push('/(tabs)/calendar'),
              },
            ].map((action, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.actionCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideUpAnim.interpolate({
                          inputRange: [0, 30],
                          outputRange: [0, 5 * index]
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={action.onPress}
                >
                  <LinearGradient
                    colors={[action.color, `${action.color}DD`]}
                    style={styles.actionIcon}
                  >
                    <Ionicons name={action.icon} size={24} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </TouchableOpacity>
              </Animated.View>
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
  loadingText: {
    color: COLORS.white,
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  workoutCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  workoutCardContent: {
    padding: 20,
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
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutMetaText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  workoutBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workoutBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  nutritionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  addMealButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macrosContainer: {
    gap: 16,
  },
  macroItem: {
    gap: 8,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  macroLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyNutrition: {
    padding: 30,
    alignItems: 'center',
  },
  emptyNutritionText: {
    color: COLORS.gray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  logMealButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logMealButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activityCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyActivity: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyActivityText: {
    color: COLORS.gray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
});