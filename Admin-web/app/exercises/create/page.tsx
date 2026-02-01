'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Dumbbell, Save } from 'lucide-react';
import { exercisesAPI } from '@/lib/api';

export default function CreateExercisePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'strength',
    muscle_group: '',
    difficulty: 'beginner',
    equipment: '',
    img_url: '',
    video_url: '',
    instructions: '',
    sets_reps_default: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert sets_reps_default to number if it exists
      const dataToSend = {
        ...formData,
        ...(formData.sets_reps_default && { 
          sets_reps_default: parseInt(formData.sets_reps_default) 
        })
      };
      
      await exercisesAPI.create(dataToSend);
      router.push('/exercises');
      router.refresh();
    } catch (error) {
      console.error('Error creating exercise:', error);
      alert('Failed to create exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const categories = ['strength', 'cardio', 'flexibility', 'balance', 'endurance'];
  const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full body'];
  const equipmentList = ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance bands', 'machine', 'none'];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/exercises" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exercises
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Exercise</h1>
            <p className="text-muted-foreground mt-2">
              Add a new exercise to your training library
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="create-exercise-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Exercise
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form 
          id="create-exercise-form"
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg shadow-sm"
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Exercise Details</h2>
                <p className="text-sm text-muted-foreground">Fill in the basic information</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exercise Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  placeholder="e.g., Push-ups, Bench Press, Squat"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  value={formData.muscle_group}
                  onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  type="number"
                  value={formData.sets_reps_default}
                  onChange={(e) => setFormData({ ...formData, sets_reps_default: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  placeholder="e.g., 10 (for 10 reps)"
                />
                <p className="text-xs text-muted-foreground">
                  Number of repetitions per set
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.img_url}
                  onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Brief description of the exercise..."
              />
              <p className="text-xs text-muted-foreground">
                What does this exercise target and what are its benefits?
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Detailed Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Step-by-step instructions for proper form and technique..."
              />
              <p className="text-xs text-muted-foreground">
                Include proper form cues, common mistakes to avoid, and safety tips
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}