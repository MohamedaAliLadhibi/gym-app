import apiClient from './client';
import { Meal, NutritionPlan, FoodItem } from '../types';

export const nutritionAPI = {
  // Get daily nutrition
  getDailyNutrition: async (date?: string): Promise<any> => {
    const response = await apiClient.get('/nutrition/daily', { params: { date } });
    return response.data;
  },
  
  // Log meal
  logMeal: async (mealData: Partial<Meal>): Promise<Meal> => {
    const response = await apiClient.post('/nutrition/meals', mealData);
    return response.data;
  },
  
  // Update meal
  updateMeal: async (id: string, mealData: Partial<Meal>): Promise<Meal> => {
    const response = await apiClient.put(`/nutrition/meals/${id}`, mealData);
    return response.data;
  },
  
  // Delete meal
  deleteMeal: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/nutrition/meals/${id}`);
    return response.data;
  },
  
  // Search foods
  searchFoods: async (query: string): Promise<FoodItem[]> => {
    const response = await apiClient.get('/nutrition/foods/search', { params: { query } });
    return response.data;
  },
  
  // Get nutrition plan
  getNutritionPlan: async (): Promise<NutritionPlan> => {
    const response = await apiClient.get('/nutrition/plan');
    return response.data;
  },
  
  // Update nutrition goals
  updateNutritionGoals: async (goals: any): Promise<any> => {
    const response = await apiClient.put('/nutrition/goals', goals);
    return response.data;
  },
  
  // Get water intake
  getWaterIntake: async (date?: string): Promise<any> => {
    const response = await apiClient.get('/nutrition/water', { params: { date } });
    return response.data;
  },
  
  // Log water intake
  logWater: async (amount: number): Promise<any> => {
    const response = await apiClient.post('/nutrition/water', { amount });
    return response.data;
  },
};