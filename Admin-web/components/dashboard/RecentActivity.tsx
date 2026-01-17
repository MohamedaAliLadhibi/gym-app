'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, UserPlus, CreditCard, Clock } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { dashboardAPI } from '@/lib/api';
import { Activity } from '@/lib/types';

const RecentActivity = () => {
  const { data: activities, loading, error } = useFetch<Activity[]>(dashboardAPI.getRecentActivity);

  const getActivityIcon = (type: Activity['type']) => {
    switch(type) {
      case 'user_registered': return <UserPlus className="h-5 w-5 text-chart-1" />;
      case 'membership_purchased': return <CreditCard className="h-5 w-5 text-chart-2" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-chart-4" />;
      default: return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) return (
    <div className="bg-card rounded-lg shadow border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-card rounded-lg shadow border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="text-destructive">Error loading activities: {error}</div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.slice(0, 6).map((activity: Activity) => (
              <div key={activity.id} className="flex items-start"> {/* Changed from activity._id to activity.id */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'success' 
                      ? 'bg-success/10 text-success'
                      : activity.status === 'error'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;