'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Search, Plus, Target, Clock, Edit, Trash2, X, User, AlertCircle, Play } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/lib/types';
import EditExerciseModal from '@/components/EditExerciseModal';

export default function ExercisesPage() {
  const { data: exercises, loading, error, execute: refreshExercises } = useFetch<Exercise[]>(exercisesAPI.getAll);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMuscle, setFilterMuscle] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Get unique muscle groups from exercises
  const muscleGroups = React.useMemo(() => {
    if (!exercises) return [];
    const muscles = exercises.map(ex => ex.muscle_group).filter(Boolean);
    return ['all', ...Array.from(new Set(muscles))];
  }, [exercises]);

  const filteredExercises = exercises?.filter((exercise: Exercise) => {
    const matchesSearch = 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    const matchesMuscle = filterMuscle === 'all' || exercise.muscle_group === filterMuscle;
    return matchesSearch && matchesDifficulty && matchesMuscle;
  }) || [];

  const handleEdit = async (formData: Partial<Exercise>) => {
    if (!editingExercise) return;
    
    try {
      // Convert sets_reps_default to number if it exists
      const dataToSend = {
        ...formData,
        ...(formData.sets_reps_default && { 
          sets_reps_default: typeof formData.sets_reps_default === 'string' 
            ? parseInt(formData.sets_reps_default) 
            : formData.sets_reps_default
        })
      };
      
      await exercisesAPI.update(editingExercise.id, dataToSend);
      refreshExercises();
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    try {
      await exercisesAPI.delete(id);
      refreshExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Failed to delete exercise. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const openDetailModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const closeDetailModal = () => {
    setSelectedExercise(null);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Exercises Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {exercises?.length || 0} exercises in your library
          </p>
        </div>
        <Link 
          href="/exercises/create"
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Exercise
        </Link>
      </div>

      {/* Filters */}
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
              <select
                value={filterMuscle}
                onChange={(e) => setFilterMuscle(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground text-sm"
              >
                <option value="all">All Muscle Groups</option>
                {muscleGroups.slice(1).map((muscle: string) => (
                  <option key={muscle} value={muscle}>
                    {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise: Exercise) => (
              <div 
                key={exercise.id} 
                className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow group relative cursor-pointer"
                onClick={() => openDetailModal(exercise)}
              >
                {isDeleting === exercise.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                    <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {exercise.name}
                      </h3>
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
                    <Target className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                    <span className="text-sm text-foreground">Muscle: </span>
                    <span className="text-sm text-muted-foreground ml-2 truncate">{exercise.muscle_group}</span>
                  </div>

                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                    <span className="text-sm text-foreground">Equipment: </span>
                    <span className="text-sm text-muted-foreground ml-2 truncate">{exercise.equipment}</span>
                  </div>

                  {exercise.sets_reps_default && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">Reps: </span>
                      <span className="text-sm text-muted-foreground ml-2 truncate">{exercise.sets_reps_default}</span>
                    </div>
                  )}
                </div>

                {exercise.img_url && (
                  <div className="mb-4">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted group-hover:opacity-90 transition-opacity">
                      <img 
                        src={exercise.img_url} 
                        alt={exercise.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(exercise.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(exercise);
                      }}
                      disabled={isDeleting === exercise.id}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exercise.id);
                      }}
                      disabled={isDeleting === exercise.id}
                      className="flex items-center gap-1 text-destructive hover:text-destructive/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {exercises?.length === 0 
                ? 'No exercises found. Create your first exercise to get started.'
                : 'No exercises match your search criteria.'
              }
            </div>
          )}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedExercise.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedExercise.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : selectedExercise.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedExercise.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {selectedExercise.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {selectedExercise.muscle_group}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Image and Video */}
                  <div className="space-y-4">
                    {selectedExercise.img_url && (
                      <div className="rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={selectedExercise.img_url} 
                          alt={selectedExercise.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    {selectedExercise.video_url && (
                      <div className="rounded-lg overflow-hidden bg-black">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-white" />
                            <span className="text-white font-medium">Exercise Video</span>
                          </div>
                          <a 
                            href={selectedExercise.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedExercise.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Muscle Group</span>
                        </div>
                        <p className="text-foreground font-semibold">{selectedExercise.muscle_group}</p>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Dumbbell className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Equipment</span>
                        </div>
                        <p className="text-foreground font-semibold">{selectedExercise.equipment}</p>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Default Reps</span>
                        </div>
                        <p className="text-foreground font-semibold">{selectedExercise.sets_reps_default || 'N/A'}</p>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Difficulty</span>
                        </div>
                        <p className="text-foreground font-semibold capitalize">{selectedExercise.difficulty}</p>
                      </div>
                    </div>

                    {selectedExercise.instructions && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-muted-foreground whitespace-pre-line">{selectedExercise.instructions}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Created: </span>
                          {new Date(selectedExercise.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Updated: </span>
                          {new Date(selectedExercise.updated_at).toLocaleDateString()}
                        </div>
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
                    openEditModal(selectedExercise);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Exercise
                </button>
                <button 
                  onClick={() => {
                    closeDetailModal();
                    handleDelete(selectedExercise.id);
                  }}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Exercise
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
      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          isOpen={isModalOpen}
          onClose={closeEditModal}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}