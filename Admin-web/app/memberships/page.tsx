'use client';

import React, { useState } from 'react';
import { CreditCard, Search, Plus, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { membershipsAPI } from '@/lib/api';
import { Membership } from '@/lib/types';

export default function MembershipsPage() {
  const { data: memberships, loading, error, execute: refreshMemberships } = useFetch<Membership[]>(membershipsAPI.getAll);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter memberships with safety checks
  const filteredMemberships = memberships?.filter((membership: Membership) => {
    if (!membership) return false;
    
    const name = membership.name || '';
    const description = membership.description || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  // Helper function to safely get features array
  const getFeatures = (membership: Membership): string[] => {
    if (!membership.features) return [];
    
    if (Array.isArray(membership.features)) {
      return membership.features;
    }
    
    // If features is a string, try to parse it or convert to array
    if (typeof membership.features === 'string') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(membership.features);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // If not JSON, split by comma or return as single item array
        return membership.features.split(',').map(f => f.trim()).filter(f => f.length > 0);
      }
    }
    
    return [];
  };

  // Helper to get price display
  const getPriceDisplay = (membership: Membership) => {
    const price = membership.price || 0;
    const duration = membership.duration_days;
    
    if (duration && duration > 0) {
      return `$${price}/month`;
    }
    return price === 0 ? 'Free' : `$${price}`;
  };

  if (loading) return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Memberships Management</h1>
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Memberships Management</h1>
      </div>
      <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive text-lg mb-2">Error loading memberships</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => refreshMemberships()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Retry Loading
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Memberships Management ({memberships?.length || 0})
        </h1>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Membership
        </button>
      </div>

      <div className="bg-card rounded-lg shadow border border-border mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">All Memberships</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search memberships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {memberships && memberships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemberships.map((membership: Membership) => {
                if (!membership) return null;
                
                const features = getFeatures(membership);
                const priceDisplay = getPriceDisplay(membership);
                const createdAt = membership.created_at 
                  ? new Date(membership.created_at).toLocaleDateString()
                  : 'Unknown date';

                return (
                  <div key={membership.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {membership.name || 'Unnamed Membership'}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            (membership.name || '').toLowerCase() === 'free' 
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              : (membership.name || '').toLowerCase() === 'premium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : (membership.name || '').toLowerCase() === 'pro'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {membership.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {membership.description || 'No description available'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm text-foreground">Price</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">
                          {priceDisplay}
                        </span>
                      </div>

                      {membership.duration_days && membership.duration_days > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm text-foreground">Duration</span>
                          </div>
                          <span className="text-sm text-foreground">{membership.duration_days} days</span>
                        </div>
                      )}
                    </div>

                    {features.length > 0 ? (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-foreground mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="mb-6 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground text-center">
                          No features listed
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Created: {createdAt}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary/80 text-sm">Edit</button>
                        <button className="text-destructive hover:text-destructive/80 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No memberships found</p>
              <p className="text-sm">Create your first membership plan to get started.</p>
            </div>
          )}

          {memberships && memberships.length > 0 && filteredMemberships.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No memberships match your search</p>
              <p className="text-sm">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}