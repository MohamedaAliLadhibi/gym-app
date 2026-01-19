// components/EditMembershipModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Membership } from '@/lib/types';

interface EditMembershipModalProps {
  membership: Membership;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Membership>) => Promise<void>;
}

export default function EditMembershipModal({ membership, isOpen, onClose, onSave }: EditMembershipModalProps) {
  const [formData, setFormData] = useState<Partial<Membership>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    if (membership) {
      setFormData({
        name: membership.name || '',
        description: membership.description || '',
        price: membership.price || 0,
        duration_days: membership.duration_days || 0,
        // Only include if they exist
        ...('category' in membership && { category: membership.category || 'standard' }),
        ...('is_active' in membership && { is_active: membership.is_active !== undefined ? membership.is_active : true }),
        features: membership.features || []
      });

      // Convert features array to text for textarea
      if (membership.features) {
        if (Array.isArray(membership.features)) {
          setFeaturesText(membership.features.join('\n'));
        } else if (typeof membership.features === 'string') {
          try {
            const parsed = JSON.parse(membership.features);
            if (Array.isArray(parsed)) {
              setFeaturesText(parsed.join('\n'));
            } else {
              setFeaturesText(membership.features);
            }
          } catch {
            setFeaturesText(membership.features);
          }
        }
      }
    }
  }, [membership]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert features text to array
      const featuresArray = featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      const dataToSave: Partial<Membership> = {
        ...formData,
        features: featuresArray
      };
      
      console.log('Saving membership data:', dataToSave);
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving membership:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">Edit Membership</h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Membership Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground min-h-[80px]"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration_days || 0}
                  onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Only show category field if it exists in formData */}
            {'category' in formData && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={formData.category || 'standard'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  disabled={isSubmitting}
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Features (one per line)
              </label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground min-h-[100px]"
                rows={4}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter each feature on a new line
              </p>
            </div>

            {/* Only show is_active checkbox if it exists in formData */}
            {'is_active' in formData && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-primary rounded border-input"
                  disabled={isSubmitting}
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-foreground">
                  Active Membership
                </label>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}