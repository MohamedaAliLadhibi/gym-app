'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Trash2, X, Clock, Tag } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { membershipsAPI } from '@/lib/api';
import { Membership } from '@/lib/types';
import EditMembershipModal from '@/components/EditMembershipModal';
export default function MembershipsPage() {
  const { data: memberships, loading, error, execute: refreshMemberships } = useFetch<Membership[]>(membershipsAPI.getAll);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Debug: Log the fetched data
  useEffect(() => {
    if (memberships) {
      console.log('Fetched memberships:', memberships);
      console.log('First membership:', memberships[0]);
      console.log('Has category?', memberships[0]?.category);
      console.log('Has is_active?', memberships[0]?.is_active);
    }
  }, [memberships]);

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

  // Helper to get membership type badge color
  const getMembershipBadgeColor = (membershipName?: string) => {
    const name = (membershipName || '').toLowerCase();
    if (name.includes('free')) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    if (name.includes('premium')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (name.includes('pro')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const openEditModal = (membership: Membership) => {
    setEditingMembership(membership);
    setIsModalOpen(true);
  };

  const openDetailModal = (membership: Membership) => {
    setSelectedMembership(membership);
  };

  const closeDetailModal = () => {
    setSelectedMembership(null);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
  };

  const handleEdit = async (formData: Partial<Membership>) => {
    if (!editingMembership) return;
    
    try {
      // Prepare data for API
      const dataToSend = {
        ...formData,
        ...(formData.price && { 
          price: typeof formData.price === 'string' 
            ? parseFloat(formData.price) 
            : formData.price
        }),
        ...(formData.duration_days && { 
          duration_days: typeof formData.duration_days === 'string' 
            ? parseInt(formData.duration_days) 
            : formData.duration_days
        }),
        // Handle features array conversion
        ...(formData.features && { 
          features: Array.isArray(formData.features) 
            ? formData.features 
            : typeof formData.features === 'string' 
              ? formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
              : []
        })
      };
      
      console.log('Sending update data:', dataToSend);
      await membershipsAPI.update(editingMembership.id, dataToSend);
      refreshMemberships();
    } catch (error) {
      console.error('Error updating membership:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    try {
      await membershipsAPI.delete(id);
      refreshMemberships();
    } catch (error) {
      console.error('Error deleting membership:', error);
      alert('Failed to delete membership. Please try again.');
    } finally {
      setIsDeleting(null);
    }
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
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Memberships Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {memberships?.length || 0} membership plans
          </p>
        </div>
        <button className="flex items-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
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
                const badgeColor = getMembershipBadgeColor(membership.name);

                return (
                  <div 
                    key={membership.id} 
                    className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openDetailModal(membership)}
                  >
                    {isDeleting === membership.id && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                        <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {membership.name || 'Unnamed Membership'}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
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
                          {features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                          {features.length > 3 && (
                            <li className="text-xs text-muted-foreground ml-5">
                              +{features.length - 3} more features
                            </li>
                          )}
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
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => openEditModal(membership)}
                          disabled={isDeleting === membership.id}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(membership.id)}
                          disabled={isDeleting === membership.id}
                          className="flex items-center gap-1 text-destructive hover:text-destructive/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
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

      {/* Membership Detail Modal */}
      {selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedMembership.name || 'Unnamed Membership'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getMembershipBadgeColor(selectedMembership.name)}`}>
                      {selectedMembership.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={closeDetailModal}
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMembership.description || 'No description available'}
                    </p>
                  </div>

                  {/* Price and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Price</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{getPriceDisplay(selectedMembership)}</p>
                    </div>

                    {selectedMembership.duration_days && selectedMembership.duration_days > 0 && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Duration</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{selectedMembership.duration_days} days</p>
                      </div>
                    )}

                    {/* Optional: Category - only show if exists */}
                    {'category' in selectedMembership && selectedMembership.category && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Type</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {selectedMembership.category || 'Standard'}
                        </p>
                      </div>
                    )}

                    {/* Optional: Status - only show if exists */}
                    {'is_active' in selectedMembership && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Status</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedMembership.is_active !== false ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
                    {getFeatures(selectedMembership).length > 0 ? (
                      <ul className="space-y-2">
                        {getFeatures(selectedMembership).map((feature, index) => (
                          <li key={index} className="flex items-start text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-muted-foreground text-center">No features listed</p>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Created: </span>
                        {selectedMembership.created_at 
                          ? new Date(selectedMembership.created_at).toLocaleDateString()
                          : 'Unknown date'}
                      </div>
                      <div>
                        <span className="font-medium">Updated: </span>
                        {selectedMembership.updated_at 
                          ? new Date(selectedMembership.updated_at).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex justify-between">
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    closeDetailModal();
                    openEditModal(selectedMembership);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Membership
                </button>
                <button 
                  onClick={() => {
                    closeDetailModal();
                    handleDelete(selectedMembership.id);
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Membership
                </button>
              </div>
              <button 
                onClick={closeDetailModal}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMembership && (
        <EditMembershipModal
          membership={editingMembership}
          isOpen={isModalOpen}
          onClose={closeEditModal}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}