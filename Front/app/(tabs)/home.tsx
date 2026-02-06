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
import { useAuth } from '@/app/context/AuthContext';
import { Palette } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: Palette.orange,
  secondary: Palette.orangeDark,
  accent: Palette.white,
  dark: Palette.black,
  light: Palette.gray50,
  white: Palette.white,
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: Palette.gray500,
};

// TEMPORARY API MOCK - Replace with your actual API calls
const mockAPI = {
  workoutsAPI: {
    getFeaturedWorkouts: async () => {
      // Mock data - replace with actual API call
      return [
        {
          id: '1',
          title: 'Full Body Burn',
          duration: 45,
          caloriesBurned: 350,
          difficulty: 'intermediate',
          description: 'A complete full-body workout focusing on strength and endurance.'
        }
      ];
    },
    getWorkoutHistory: async () => {
      // Mock data - replace with actual API call
      return {
        data: [
          {
            id: '1',
            workout: { title: 'Morning Cardio' },
            completedAt: new Date().toISOString(),
            duration: 30,
            caloriesBurned: 250
          },
          {
            id: '2',
            workout: { title: 'Strength Training' },
            completedAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
            duration: 45,
            caloriesBurned: 350
          }
        ]
      };
    }
  }
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
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
      
      // Fetch featured workouts - using mock for now
      const workouts = await mockAPI.workoutsAPI.getFeaturedWorkouts();
      setFeaturedWorkouts(workouts);
      
      // Fetch workout history - using mock for now
      const history = await mockAPI.workoutsAPI.getWorkoutHistory();
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
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.full_name || user?.name || 'Fitness Warrior'}!</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
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
              <Ionicons name="barbell" size={24} color={COLORS.white} />
              <Text style={styles.statNumber}>
                {workoutHistory.length || 0}
              </Text>
              <Text style={styles.statLabel}>Workouts This Week</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.secondary, '#60A5FA']}
              style={styles.statGradient}
            >
              <Ionicons name="trophy" size={24} color={COLORS.white} />
              <Text style={styles.statNumber}>
                {featuredWorkouts.length || 0}
              </Text>
              <Text style={styles.statLabel}>Available Workouts</Text>
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
                title: 'Calendar',
                icon: 'calendar',
                color: COLORS.secondary,
                onPress: () => router.push('/(tabs)/calendar'),
              },
              {
                title: 'Exercises',
                icon: 'fitness',
                color: COLORS.success,
                onPress: () => router.push('/(tabs)/exercise'),
              },
              {
                title: 'Profile',
                icon: 'person',
                color: COLORS.accent,
                onPress: () => router.push('/(tabs)/profile'),
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

// Styles remain the same as before...
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