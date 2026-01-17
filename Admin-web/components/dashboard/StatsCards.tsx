'use client';

import React from 'react';
import { Users, Dumbbell, CreditCard, TrendingUp } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { dashboardAPI } from '@/lib/api';
import { DashboardStats } from '@/lib/types';

const StatsCards = () => {
  const { data: stats, loading, error } = useFetch<DashboardStats>(dashboardAPI.getStats);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
  
  if (error) return (
    <div className="text-destructive border border-destructive/20 rounded-lg p-4 mb-8">
      Error loading stats: {error}
    </div>
  );

  const statItems = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-chart-1" />,
      change: stats?.userGrowth || '+12%',
      color: 'bg-card border border-border',
      textColor: 'text-chart-1',
    },
    {
      title: 'Active Exercises',
      value: stats?.totalExercises || 0,
      icon: <Dumbbell className="h-6 w-6 text-chart-2" />,
      change: stats?.exerciseGrowth || '+8%',
      color: 'bg-card border border-border',
      textColor: 'text-chart-2',
    },
    {
      title: 'Active Memberships',
      value: stats?.activeMemberships || 0,
      icon: <CreditCard className="h-6 w-6 text-chart-3" />,
      change: stats?.membershipGrowth || '+5%',
      color: 'bg-card border border-border',
      textColor: 'text-chart-3',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6 text-chart-4" />,
      change: stats?.revenueGrowth || '+15%',
      color: 'bg-card border border-border',
      textColor: 'text-chart-4',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {stat.value}
              </p>
              <p className={`text-sm ${stat.textColor} mt-1`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-3 bg-background rounded-full shadow-sm">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;