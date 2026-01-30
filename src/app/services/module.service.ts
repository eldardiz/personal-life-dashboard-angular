import { Injectable } from '@angular/core';
import { TrackerModule } from '../models/tracker.model';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private availableModules: TrackerModule[] = [
    {
      id: 'habit',
      name: 'Habit Tracker',
      icon: '✅',
      description: 'Track your daily habits',
      enabled: false,
      color: '#FF6B6B',
    },
    {
      id: 'sleep',
      name: 'Sleep Tracker',
      icon: '😴',
      description: 'Monitor your sleep patterns',
      enabled: false,
      color: '#4ECDC4',
    },
    {
      id: 'study',
      name: 'Study Planner',
      icon: '📚',
      description: 'Plan your study sessions',
      enabled: false,
      color: '#45B7D1',
    },
    {
      id: 'fitness',
      name: 'Yoga/Fitness',
      icon: '🧘',
      description: 'Track workouts and yoga',
      enabled: false,
      color: '#96CEB4',
    },
    {
      id: 'task',
      name: 'Task Planner',
      icon: '📋',
      description: 'Manage tasks and projects',
      enabled: false,
      color: '#FFEAA7',
    },
    {
      id: 'meal',
      name: 'Meal Planner',
      icon: '🍽️',
      description: 'Plan your meals',
      enabled: false,
      color: '#DFE6E9',
    },
    {
      id: 'mood',
      name: 'Mood Tracker',
      icon: '😊',
      description: 'Track your daily mood',
      enabled: false,
      color: '#FD79A8',
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: '📅',
      description: 'View your calendar',
      enabled: false,
      color: '#A29BFE',
    },
    {
      id: 'finance',
      name: 'Finance Tracker',
      icon: '💰',
      description: 'Track expenses',
      enabled: false,
      color: '#00B894',
    },
    {
      id: 'gratitude',
      name: 'Gratitude Journal',
      icon: '🙏',
      description: 'Daily gratitude practice',
      enabled: false,
      color: '#FDCB6E',
    },
    {
      id: 'reflection',
      name: 'Daily Reflection',
      icon: '💭',
      description: 'Reflect on your day',
      enabled: false,
      color: '#6C5CE7',
    },
    {
      id: 'water',
      name: 'Water Intake',
      icon: '💧',
      description: 'Track water consumption',
      enabled: false,
      color: '#74B9FF',
    },
    {
      id: 'reading',
      name: 'Reading Tracker',
      icon: '📖',
      description: 'Track books and pages',
      enabled: false,
      color: '#E17055',
    },
  ];

  constructor() {}

  getAllModules(): TrackerModule[] {
    return [...this.availableModules];
  }

  getModuleById(id: string): TrackerModule | undefined {
    return this.availableModules.find((m) => m.id === id);
  }
}
