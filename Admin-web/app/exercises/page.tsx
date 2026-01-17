'use client';

import React, { useState } from 'react';
import { Dumbbell, Search, Plus, Target, Clock, Flame } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/lib/types';

export default function ExercisesPage() {
  const { data: exercises, loading, error, execute: refreshExercises } = useFetch<Exercise[]>(exercisesAPI.getAll);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filteredExercises = exercises?.filter((exercise: Exercise) => {
    const matchesSearch = 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  if (loading) return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Exercises Management</h1>
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
      </div>
      <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Exercises Management</h1>
      </div>
      <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
        <p className="text-destructive">Error loading exercises: {error}</p>
        <button 
          onClick={() => refreshExercises()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Exercises Management ({exercises?.length || 0})
        </h1>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Exercise
        </button>
      </div>

      <div className="bg-card rounded-lg shadow border border-border mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">All Exercises</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground w-full sm:w-64"
                />
              </div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground text-sm"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise: Exercise) => (
              <div key={exercise.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{exercise.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          exercise.difficulty === 'beginner' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : exercise.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {exercise.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {exercise.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{exercise.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-foreground">Muscle Group: </span>
                    <span className="text-sm text-muted-foreground ml-2">{exercise.muscle_group}</span>
                  </div>

                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-foreground">Equipment: </span>
                    <span className="text-sm text-muted-foreground ml-2">{exercise.equipment}</span>
                  </div>

                  {exercise.sets_reps_default && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-foreground">Sets/Reps: </span>
                      <span className="text-sm text-muted-foreground ml-2">{exercise.sets_reps_default}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Created: {new Date(exercise.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary/80 text-sm">Edit</button>
                    <button className="text-destructive hover:text-destructive/80 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {exercises?.length === 0 
                ? 'No exercises found. Add your first exercise.'
                : 'No exercises match your search.'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}