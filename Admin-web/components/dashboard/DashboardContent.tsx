'use client';

import React from 'react';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';

const DashboardContent = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Dashboard Overview
      </h1>
      <StatsCards />
      <RecentActivity />
    </div>
  );
};

export default DashboardContent;