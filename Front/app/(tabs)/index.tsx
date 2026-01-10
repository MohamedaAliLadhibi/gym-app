import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Updated color palette - Black, Light Blue, Purple
const COLORS = {
  // Main colors
  black: '#000000',
  darkBlack: '#0A0A0A',
  charcoal: '#121212',
  
  // Light Blue colors
  lightBlue: '#4FC3F7',
  cyan: '#00E5FF',
  skyBlue: '#29B6F6',
  deepBlue: '#0288D1',
  
  // Purple colors
  purple: '#9C27B0',
  lightPurple: '#BA68C8',
  deepPurple: '#7B1FA2',
  
  // Accent colors
  neonBlue: '#00D4FF',
  electricPurple: '#D500F9',
  
  // UI colors
  white: '#FFFFFF',
  grayLight: 'rgba(255,255,255,0.7)',
  gray: 'rgba(255,255,255,0.5)',
  darkGray: 'rgba(255,255,255,0.1)',
} as const;

export default function HomeScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Start animations on mount
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Pulsing animation for CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Features data with black/blue/purple theme
  const features = [
    {
      id: 1,
      icon: 'dumbbell',
      title: 'Smart Workouts',
      desc: 'AI-powered workout plans',
      colors: [COLORS.lightBlue, COLORS.cyan] as const,
    },
    {
      id: 2,
      icon: 'food-apple',
      title: 'Nutrition Tracker',
      desc: 'Calorie & protein calculator',
      colors: [COLORS.purple, COLORS.lightPurple] as const,
    },
    {
      id: 3,
      icon: 'chart-timeline-variant',
      title: 'Progress Analytics',
      desc: 'Visual progress tracking',
      colors: [COLORS.deepBlue, COLORS.skyBlue] as const,
    },
    {
      id: 4,
      icon: 'run',
      title: 'Exercise Library',
      desc: '500+ exercises with videos',
      colors: [COLORS.deepPurple, COLORS.electricPurple] as const,
    },
  ];

  // Workout categories
  const workoutCategories = [
    { name: 'Strength', icon: 'arm-flex', count: '45 exercises', color: COLORS.lightBlue },
    { name: 'Cardio', icon: 'run-fast', count: '28 exercises', color: COLORS.cyan },
    { name: 'Flexibility', icon: 'yoga', count: '32 exercises', color: COLORS.purple },
    { name: 'HIIT', icon: 'timer', count: '18 exercises', color: COLORS.electricPurple },
  ];

  // Daily goals
  const dailyGoals = [
    { label: 'Protein', value: '120g', target: '150g', progress: 0.8, color: COLORS.lightBlue },
    { label: 'Calories', value: '1800', target: '2200', progress: 0.65, color: COLORS.purple },
    { label: 'Water', value: '1.8L', target: '3L', progress: 0.6, color: COLORS.cyan },
  ];

  // Popular workouts
  const popularWorkouts = [
    { name: 'Upper Body Power', time: '45 min', calories: '500', color: COLORS.lightBlue },
    { name: 'Leg Day Blast', time: '60 min', calories: '650', color: COLORS.purple },
    { name: 'Core Crusher', time: '30 min', calories: '350', color: COLORS.cyan },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero Section with Black/Blue/Purple Gradient */}
      <Animated.View 
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={[COLORS.black, COLORS.charcoal, COLORS.darkBlack] as readonly [string, string, string]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Animated Particles Effect */}
        <View style={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: [COLORS.lightBlue, COLORS.purple, COLORS.cyan][i % 3],
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                }
              ]}
            />
          ))}
        </View>
        
        {/* Animated Top Bar */}
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
            <LinearGradient
              colors={[COLORS.lightBlue, COLORS.cyan] as readonly [string, string]}
              style={styles.avatarContainer}
            >
              <Icon name="account" size={28} color={COLORS.white} />
            </LinearGradient>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>Fitness Warrior! 💪</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <LinearGradient
              colors={[COLORS.purple, COLORS.electricPurple] as readonly [string, string]}
              style={styles.badgeContainer}
            >
              <Icon name="fire" size={24} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Title with Animation */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[COLORS.lightBlue, COLORS.cyan, COLORS.purple] as readonly [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientTextContainer}
          >
            <Text style={styles.mainTitle}>POWER</Text>
            <Text style={styles.mainTitle}>PERFORMANCE</Text>
            <Text style={styles.mainTitle}>PROGRESS</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>
            Transform your body with AI-powered workouts & smart nutrition tracking
          </Text>
        </Animated.View>

        {/* Animated CTA Button */}
        <Animated.View 
          style={[
            styles.ctaContainer,
            {
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.primaryBtn}>
            <LinearGradient
              colors={[COLORS.lightBlue, COLORS.purple] as readonly [string, string]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Icon name="lightning-bolt" size={24} color={COLORS.white} />
            <Text style={styles.primaryBtnText}>BEGIN TRANSFORMATION</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        {[
          { value: '500+', label: 'Exercises', icon: 'dumbbell', color: COLORS.lightBlue },
          { value: '24/7', label: 'AI Coach', icon: 'robot', color: COLORS.purple },
          { value: '10k+', label: 'Success Stories', icon: 'trophy', color: COLORS.cyan },
        ].map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <LinearGradient
              colors={[stat.color, COLORS.black] as readonly [string, string]}
              style={styles.statIconContainer}
            >
              <Icon name={stat.icon} size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Features Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Smart Features</Text>
        <Text style={styles.sectionSubtitle}>Elevate your fitness journey</Text>
        
        <Animated.View 
          style={[
            styles.featuresGrid,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          {features.map((feature, index) => (
            <Animated.View 
              key={feature.id}
              style={[
                styles.featureCard,
                {
                  transform: [
                    { 
                      translateY: slideUpAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 20 * index]
                      })
                    }
                  ]
                }
              ]}
            >
              <TouchableOpacity style={styles.featureCardInner}>
                <LinearGradient
                  colors={feature.colors}
                  style={styles.featureIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name={feature.icon} size={28} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </View>

      {/* Workout Categories - Horizontal Scroll */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Workout Categories</Text>
        <Text style={styles.sectionSubtitle}>Choose your training style</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {workoutCategories.map((category, index) => (
            <Animated.View
              key={index}
              style={[
                styles.categoryCard,
                {
                  transform: [
                    { 
                      translateX: slideUpAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 20 * index]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[category.color, `${category.color}80`] as readonly [string, string]}
                style={styles.categoryCardInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name={category.icon} size={32} color={COLORS.white} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
                <TouchableOpacity style={styles.categoryBtn}>
                  <Text style={styles.categoryBtnText}>EXPLORE →</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Nutrition Tracker */}
      <LinearGradient
        colors={[COLORS.charcoal, COLORS.black] as readonly [string, string]}
        style={styles.nutritionSection}
      >
        <View style={styles.nutritionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Nutrition Tracker</Text>
            <Text style={styles.sectionSubtitle}>Track calories & protein</Text>
          </View>
          <TouchableOpacity style={styles.addMealBtn}>
            <Icon name="plus" size={20} color={COLORS.white} />
            <Text style={styles.addMealText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
        
        {dailyGoals.map((goal, index) => (
          <Animated.View 
            key={index}
            style={[
              styles.goalCard,
              {
                transform: [
                  { 
                    translateX: slideUpAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 10 * index]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Icon 
                  name={
                    goal.label === 'Protein' ? 'food-drumstick' :
                    goal.label === 'Calories' ? 'fire' : 'water'
                  } 
                  size={20} 
                  color={goal.color} 
                />
              </View>
              <Text style={styles.goalLabel}>{goal.label}</Text>
              <Text style={styles.goalValue}>
                {goal.value} <Text style={styles.goalTarget}>/ {goal.target}</Text>
              </Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: `${goal.progress * 100}%`,
                    backgroundColor: goal.color,
                  }
                ]}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {Math.round(goal.progress * 100)}% complete
              </Text>
              <Text style={styles.progressText}>
                {goal.label === 'Protein' ? `${150-120}g remaining` :
                 goal.label === 'Calories' ? `${2200-1800} cal remaining` :
                 `${3-1.8}L remaining`}
              </Text>
            </View>
          </Animated.View>
        ))}
      </LinearGradient>

      {/* Popular Workouts */}
      <View style={styles.sectionContainer}>
        <View style={styles.workoutsHeader}>
          <View>
            <Text style={styles.sectionTitle}>Popular Workouts</Text>
            <Text style={styles.sectionSubtitle}>Community favorites</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>VIEW ALL →</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.workoutsScroll}
        >
          {popularWorkouts.map((workout, index) => (
            <Animated.View
              key={index}
              style={[
                styles.workoutCard,
                {
                  transform: [
                    { 
                      translateX: slideUpAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 20 * index]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[workout.color, `${workout.color}CC`] as readonly [string, string]}
                style={styles.workoutCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.workoutBadge}>
                  <Icon name="trending-up" size={16} color={COLORS.white} />
                  <Text style={styles.workoutBadgeText}>TRENDING</Text>
                </View>
                <Text style={styles.workoutTitle}>{workout.name}</Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Icon name="clock-outline" size={16} color={COLORS.white} />
                    <Text style={styles.workoutStatText}>{workout.time}</Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <Icon name="fire" size={16} color={COLORS.white} />
                    <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.startWorkoutBtn}>
                  <LinearGradient
                    colors={[COLORS.white, COLORS.grayLight] as readonly [string, string]}
                    style={styles.startWorkoutBtnGradient}
                  >
                    <Text style={styles.startWorkoutText}>START NOW</Text>
                    <Icon name="arrow-right" size={16} color={COLORS.black} />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Final CTA Section */}
      <LinearGradient
        colors={[COLORS.lightBlue, COLORS.purple] as readonly [string, string]}
        style={styles.finalCtaSection}
      >
        <Text style={styles.finalCtaTitle}>Ready to Transform?</Text>
        <Text style={styles.finalCtaSubtitle}>
          Join 50,000+ members who transformed their bodies with our app
        </Text>
        <TouchableOpacity style={styles.finalCtaButton}>
          <Text style={styles.finalCtaButtonText}>GET STARTED FREE</Text>
          <Icon name="rocket-launch" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    height: height * 0.6,
    paddingTop: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS.lightBlue,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.grayLight,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationBtn: {
    padding: 5,
  },
  badgeContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  gradientTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.grayLight,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  ctaContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lightBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    minWidth: 250,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.charcoal,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  featureCardInner: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkGray,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: COLORS.lightBlue,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 160,
    marginRight: 15,
  },
  categoryCardInner: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 15,
    marginBottom: 5,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.white,
    marginBottom: 15,
    opacity: 0.8,
  },
  categoryBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  nutritionSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginVertical: 20,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addMealBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
  addMealText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  goalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    flex: 1,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  goalTarget: {
    fontSize: 14,
    color: COLORS.gray,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  workoutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutsScroll: {
    paddingRight: 20,
  },
  workoutCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  workoutCardGradient: {
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  workoutBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  workoutBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  workoutStats: {
    flexDirection: 'row',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutStatText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 5,
  },
  startWorkoutBtn: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startWorkoutBtnGradient: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startWorkoutText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  finalCtaSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  finalCtaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  finalCtaSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  finalCtaButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.black,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  finalCtaButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});