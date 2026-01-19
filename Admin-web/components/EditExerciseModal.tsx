'use client';

import React, { useState, useEffect } from 'react';
import { X, Dumbbell, Target, Clock, Flame } from 'lucide-react';
import { Exercise } from '@/lib/types';

interface EditExerciseModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Exercise>) => Promise<void>;
}

export default function EditExerciseModal({ 
  exercise, 
  isOpen, 
  onClose, 
  onSave 
}: EditExerciseModalProps) {
  const [formData, setFormData] = useState<Partial<Exercise>>(exercise);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(exercise);
  }, [exercise]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const categories = ['strength', 'cardio', 'flexibility', 'balance', 'endurance'];
  const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full body'];
  const equipmentList = ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance bands', 'machine', 'none'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Edit Exercise: {exercise.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Update exercise details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exercise Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Exercise Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Bench Press, Squat, Pull-up"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                required
                value={formData.category || 'strength'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Difficulty *
              </label>
              <select
                required
                value={formData.difficulty || 'beginner'}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Muscle Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Primary Muscle Group *
              </label>
              <select
                required
                value={formData.muscle_group || ''}
                onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="">Select muscle group</option>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Equipment *
              </label>
              <select
                required
                value={formData.equipment || ''}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="">Select equipment</option>
                {equipmentList.map(item => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sets/Reps */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Default Sets & Reps
              </label>
              <input
                type="text"
                value={formData.sets_reps_default || ''}
                onChange={(e) => setFormData({ ...formData, sets_reps_default: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                placeholder="e.g., 3x10, 4x8-12"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Image URL
              </label>
              <input
                type="url"
                value={formData.img_url || ''}
                onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                placeholder="https://example.com/exercise.gif"
              />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Video URL
              </label>
              <input
                type="url"
                value={formData.video_url || ''}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description *
            </label>
            <textarea
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Brief description of the exercise..."
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Detailed Instructions
            </label>
            <textarea
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Step-by-step instructions for proper form..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-lg text-foreground hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}