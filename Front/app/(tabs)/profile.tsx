// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { authAPI, userAPI } from '../service/api';
import { useAuth } from '@/app/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user statistics
      if (user?.id) {
        const stats = await userAPI.getStatistics(user.id);
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        const avatarUrl = await userAPI.uploadAvatar(user.id, result.assets[0].uri);
        await updateProfile({ avatar: avatarUrl.avatarUrl });
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error changing avatar:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.deleteAccount('password'); // You'll need to ask for password
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        },
      ]
    );
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
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleChangeAvatar}>
              <View style={styles.avatarContainer}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.editAvatarBadge}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.memberSince}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.gray} />
                <Text style={styles.memberSinceText}>
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {[
            { label: 'Workouts', value: userStats?.totalWorkouts || 0, icon: 'barbell' },
            { label: 'Streak', value: userStats?.currentStreak || 0, icon: 'flame' },
            { label: 'Weight', value: `${userStats?.currentWeight || 0}kg`, icon: 'scale' },
            { label: 'Level', value: userStats?.level || 1, icon: 'trophy' },
          ].map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            {[
              {
                title: 'Personal Information',
                icon: 'person-outline',
                onPress: () => router.push('/personal-info'),
              },
              {
                title: 'Goals & Preferences',
                icon: 'flag-outline',
                onPress: () => router.push('/goals'),
              },
              {
                title: 'Subscription',
                icon: 'card-outline',
                onPress: () => router.push('/subscription'),
              },
              {
                title: 'Achievements',
                icon: 'trophy-outline',
                onPress: () => router.push('/achievements'),
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={COLORS.gray} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.menuList}>
            {[
              {
                title: 'Notifications',
                icon: 'notifications-outline',
                onPress: () => router.push('/notifications-settings'),
              },
              {
                title: 'Privacy & Security',
                icon: 'shield-checkmark-outline',
                onPress: () => router.push('/privacy'),
              },
              {
                title: 'Units & Measurements',
                icon: 'settings-outline',
                onPress: () => router.push('/units'),
              },
              {
                title: 'Dark Mode',
                icon: 'moon-outline',
                onPress: () => router.push('/theme'),
                rightText: 'On',
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={COLORS.gray} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.rightText && (
                    <Text style={styles.menuItemRightText}>{item.rightText}</Text>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuList}>
            {[
              {
                title: 'Help Center',
                icon: 'help-circle-outline',
                onPress: () => router.push('/help'),
              },
              {
                title: 'Contact Us',
                icon: 'chatbubble-outline',
                onPress: () => router.push('/contact'),
              },
              {
                title: 'Rate App',
                icon: 'star-outline',
                onPress: () => router.push('/rate'),
              },
              {
                title: 'About',
                icon: 'information-circle-outline',
                onPress: () => router.push('/about'),
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={COLORS.gray} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout & Delete */}
        <View style={styles.dangerZone}>
          <TouchableOpacity 
            style={[styles.dangerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={[styles.dangerButtonText, { color: COLORS.error }]}>
              Logout
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.gray} />
            <Text style={[styles.dangerButtonText, { color: COLORS.gray }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>FitFlow v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 FitFlow. All rights reserved.</Text>
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
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dark,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberSinceText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  menuList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.white,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemRightText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  dangerZone: {
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.gray,
  },
});