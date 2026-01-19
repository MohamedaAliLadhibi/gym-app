'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Loader2, Mail, User, Phone, Calendar, 
  CreditCard, Target, MapPin, Activity,
  Edit2, AlertCircle, CheckCircle, Shield
} from 'lucide-react';
import { User as UserType, Membership } from '@/lib/types';
import { usersAPI, membershipsAPI } from '@/lib/api';

interface EditUserModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UserType>) => Promise<void>;
}

export default function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load memberships and populate form data
useEffect(() => {
  if (isOpen && user) {
    loadMemberships();
    
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      date_of_birth: user.birth_date || '',
      gender: user.gender || '',
      height: user.height ? user.height.toString() : '',
      weight: user.weight ? user.weight.toString() : '',
      fitness_goal: user.fitness_goal || '',
      experience_level: user.experience_level || '',
      membership_type_id: user.membership_type_id || '',
      role: user.role || 'user'
    });
  }
}, [isOpen, user]);

  const loadMemberships = async () => {
    setIsLoadingMemberships(true);
    try {
      const response = await membershipsAPI.getAll();
      setMemberships(response.data || []);
    } catch (err) {
      console.error('Error loading memberships:', err);
      setMemberships([]);
    } finally {
      setIsLoadingMemberships(false);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    // Send ONLY fields that exist in your database (based on your GET response)
    const dataToSend: any = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone?.trim() || null,
      gender: formData.gender || null,
      // REMOVE address - it doesn't exist in your DB!
      // DO include description and avatar_url - they DO exist
      description: user.description || null, // Keep existing or set to null
      avatar_url: user.avatar_url || null,   // Keep existing or set to null
      role: formData.role || 'user',
      // status field doesn't exist in your DB based on GET response
    };

    // Convert date_of_birth to birth_date
    if (formData.date_of_birth) {
      dataToSend.birth_date = new Date(formData.date_of_birth as string).toISOString().split('T')[0];
    }

    // Add numeric fields
    if (formData.height) {
      dataToSend.height = parseFloat(formData.height as string) || null;
    }
    if (formData.weight) {
      dataToSend.weight = parseFloat(formData.weight as string) || null;
    }

    // Membership
    if (formData.membership_type_id) {
      dataToSend.membership_type_id = formData.membership_type_id;
    }
  
    if (formData.fitness_goal) {
      dataToSend.fitness_goal = formData.fitness_goal;
    }
    if (formData.experience_level) {
      dataToSend.experience_level = formData.experience_level;
    }

    console.log('🔄 Updating user with CORRECT data:', JSON.stringify(dataToSend, null, 2));
    
    await onSave(dataToSend);
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
    
  } catch (err: any) {
    console.error('❌ Error updating user:', err);
    
    if (err.response?.data?.details) {
      const details = err.response.data.details;
      if (details.includes("Could not find the '")) {
        const columnName = details.match(/'([^']+)'/)[1];
        setError(`❌ Database error: Column "${columnName}" doesn't exist in users table`);
      } else {
        setError(`❌ ${err.response.data.details}`);
      }
    } else if (err.response?.data?.error) {
      setError(`❌ ${err.response.data.error}`);
    } else {
      setError('❌ Failed to update user');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div 
        className="bg-gradient-to-br from-card to-card/90 rounded-2xl shadow-2xl shadow-black/20 max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Edit2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Edit Member</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email} • ID: {user.id?.substring(0, 8)}...
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
              <p className="text-green-500/80">Member updated successfully</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="overflow-auto max-h-[calc(90vh-180px)] custom-scrollbar">
            <div className="p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl animate-in slide-in-from-top duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-destructive font-medium mb-1">Cannot Update User</p>
                      <p className="text-destructive/90 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Personal Info */}
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                      <span className="text-xs text-destructive ml-auto">* Required</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground transition-all"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground transition-all"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Changing email might affect login credentials
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            <Phone className="inline h-4 w-4 mr-1" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Birth Date
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Gender
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['male', 'female', 'other', 'prefer_not_to_say'].map((gender) => (
                            <label
                              key={gender}
                              className={`
                                relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all text-sm
                                ${formData.gender === gender 
                                  ? 'bg-primary/10 border-primary text-primary' 
                                  : 'border-input hover:border-muted-foreground/50 hover:bg-muted/30'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={formData.gender === gender}
                                onChange={handleChange}
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                              <span className="capitalize">
                                {gender.replace(/_/g, ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Account Status
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        User Status
                      </label>
                      <select
                        name="status"
                        value={formData.status || 'active'}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        disabled={isSubmitting}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Active users can access the gym facilities
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Fitness & Membership */}
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Fitness Profile
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-transparent border-none text-foreground text-lg focus:outline-none focus:ring-0"
                            disabled={isSubmitting}
                            placeholder="175"
                            min="0"
                          />
                        </div>

                        <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-transparent border-none text-foreground text-lg focus:outline-none focus:ring-0"
                            disabled={isSubmitting}
                            placeholder="70"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <Target className="inline h-4 w-4 mr-1" />
                          Fitness Goal
                        </label>
                        <select
                          name="fitness_goal"
                          value={formData.fitness_goal || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                          disabled={isSubmitting}
                        >
                          <option value="">Select Goal</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="endurance">Endurance</option>
                          <option value="flexibility">Flexibility</option>
                          <option value="general_fitness">General Fitness</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Experience Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <label
                              key={level}
                              className={`
                                relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all
                                ${formData.experience_level === level 
                                  ? 'bg-primary/10 border-primary text-primary' 
                                  : 'border-input hover:border-muted-foreground/50 hover:bg-muted/30'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="experience_level"
                                value={level}
                                checked={formData.experience_level === level}
                                onChange={handleChange}
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                              <span className="capitalize text-sm font-medium">
                                {level}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Membership & Location
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Membership Plan
                          {isLoadingMemberships && (
                            <Loader2 className="h-3 w-3 animate-spin ml-2 inline" />
                          )}
                        </label>
                        <select
                          name="membership_type_id"
                          value={formData.membership_type_id || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                          disabled={isSubmitting || isLoadingMemberships}
                        >
                          <option value="">No Membership (Free Access)</option>
                          {memberships.map((membership) => (
                            <option key={membership.id} value={membership.id}>
                              {membership.name} - ${membership.price}/month
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground min-h-[100px] resize-none"
                          disabled={isSubmitting}
                          placeholder="Enter full address..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border/50 bg-gradient-to-r from-card/50 to-card/30">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-input rounded-xl hover:bg-muted transition-all duration-200 disabled:opacity-50 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-4">
                {isSubmitting && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving changes...
                  </div>
                )}
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-5 w-5" />
                      Update Member
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}