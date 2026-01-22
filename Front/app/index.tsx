// app/index.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  // Main theme colors
  primary: '#7C3AED', // Purple
  secondary: '#3B82F6', // Blue
  accent: '#EC4899', // Pink
  dark: '#0F172A', // Dark blue/black
  light: '#F8FAFC', // Light gray
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
};

export default function LandingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Staggered animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleContinueAsGuest = () => {
    router.push('/(tabs)');
  };

  const features = [
    {
      icon: '🏋️',
      title: 'Smart Workouts',
      description: 'AI-generated plans based on your goals',
      color: '#7C3AED',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visual analytics & milestone tracking',
      color: '#3B82F6',
    },
    {
      icon: '🍎',
      title: 'Nutrition Plans',
      description: 'Personalized meal plans & tracking',
      color: '#10B981',
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect & compete with friends',
      color: '#EC4899',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Lost 30lbs',
      text: 'Transformed my body in 3 months!',
      avatar: '👨‍💼',
    },
    {
      name: 'Sarah Miller',
      role: 'Gained 15lbs muscle',
      text: 'Best fitness app I\'ve ever used!',
      avatar: '👩‍⚕️',
    },
    {
      name: 'Mike Chen',
      role: 'Marathon Runner',
      text: 'Took my running to the next level',
      avatar: '👨‍🏫',
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={[COLORS.dark, '#1E293B']}
        style={styles.heroSection}
      >
        <Animated.View 
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* App Logo/Title */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.logo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>FIT</Text>
            </LinearGradient>
            <Text style={styles.appName}>FitFlow</Text>
          </View>

          <Text style={styles.heroTitle}>
            Transform Your Body, {'\n'}
            <Text style={styles.heroTitleHighlight}>Transform Your Life</Text>
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Join 500,000+ people who transformed their fitness journey with AI-powered workouts and personalized nutrition plans.
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>App Store Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Workout Plans</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleGetStarted}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Get Started Free</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleContinueAsGuest}
            >
              <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <Text style={styles.ctaNote}>No credit card required • 7-day free trial</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose FitFlow?</Text>
        <Text style={styles.sectionSubtitle}>Everything you need to achieve your fitness goals</Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideUpAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 10 * index]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Demo Section */}
      <LinearGradient
        colors={['#1E293B', COLORS.dark]}
        style={styles.demoSection}
      >
        <Text style={styles.demoTitle}>See It In Action</Text>
        
        <View style={styles.demoContainer}>
          {/* Mock App Screens */}
          <View style={styles.mockupContainer}>
            <View style={[styles.mockupScreen, styles.mockup1]}>
              <View style={styles.mockupHeader}>
                <View style={styles.mockupDot} />
                <View style={styles.mockupDot} />
                <View style={styles.mockupDot} />
              </View>
              <View style={styles.mockupContent}>
                <View style={styles.mockupBar} />
                <View style={styles.mockupBar} />
                <View style={styles.mockupBar} />
              </View>
            </View>
            
            <View style={[styles.mockupScreen, styles.mockup2]}>
              <View style={styles.mockupHeader}>
                <View style={styles.mockupDot} />
                <View style={styles.mockupDot} />
                <View style={styles.mockupDot} />
              </View>
              <View style={styles.mockupContent}>
                <View style={styles.mockupCircle} />
                <View style={styles.mockupStats}>
                  <View style={styles.mockupStat} />
                  <View style={styles.mockupStat} />
                  <View style={styles.mockupStat} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <Text style={styles.sectionSubtitle}>See what our members are saying</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.testimonialsScroll}
        >
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{testimonial.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FBBF24" />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Final CTA */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.finalCta}
      >
        <Text style={styles.finalCtaTitle}>Ready to Begin Your Journey?</Text>
        <Text style={styles.finalCtaSubtitle}>
          Start your free trial today. Cancel anytime.
        </Text>
        
        <TouchableOpacity 
          style={styles.finalCtaButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.finalCtaButtonText}>Start Free Trial</Text>
          <Ionicons name="rocket-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.benefitText}>No credit card needed</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.benefitText}>Cancel anytime</Text>
          </View>
          <View style={styles.benefit}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.benefitText}>Full access to all features</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 FitFlow. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  heroSection: {
    minHeight: height * 0.9,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  heroTitleHighlight: {
    color: COLORS.secondary,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  secondaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ctaNote: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    padding: 40,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 100) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  demoSection: {
    padding: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  demoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  demoContainer: {
    alignItems: 'center',
  },
  mockupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
  },
  mockupScreen: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 15,
    width: width * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  mockup1: {
    height: 300,
    marginTop: 20,
  },
  mockup2: {
    height: 280,
  },
  mockupHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mockupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  mockupContent: {
    flex: 1,
  },
  mockupBar: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 16,
  },
  mockupCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  mockupStats: {
    gap: 12,
  },
  mockupStat: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    marginBottom: 8,
  },
  testimonialsScroll: {
    paddingRight: 40,
  },
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    marginRight: 20,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  testimonialText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  rating: {
    flexDirection: 'row',
  },
  finalCta: {
    margin: 20,
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
  },
  finalCtaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCtaSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
  },
  finalCtaButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  finalCtaButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  benefits: {
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    padding: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
  },
});