/**
 * Firebase Parser Service
 * Utility functions for fetching and parsing Firebase data for the SPS-OSX Dashboard
 */

import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define interfaces for the data types
interface Milestone {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  completion?: number;
  order?: number;
  tasks?: Task[];
  tasksCompleted?: number;
  [key: string]: any;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  milestoneId?: string;
  assignedTo?: string;
  dueDate?: Date;
  status?: string;
  completed?: boolean;
  order?: number;
  [key: string]: any;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: string;
  confidence: number;
  timestamp: Date;
  color?: string;
  [key: string]: any;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  date: Date;
  [key: string]: any;
}

interface ProjectSettings {
  name: string;
  description?: string;
  startDate?: Date;
  targetEndDate?: Date;
  [key: string]: any;
}

interface DashboardData {
  milestones: Milestone[];
  insights: Insight[];
  metrics: Metric[];
  settings: ProjectSettings | null;
}

/**
 * Helper function to convert Firestore document to typed object
 * @param doc - Firestore document
 * @returns Typed object with proper date conversion
 */
const convertDoc = <T>(doc: DocumentData): T => {
  const data = doc.data();
  const result = {
    id: doc.id,
    ...data,
  } as T;

  // Convert Firestore timestamps to JavaScript dates
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Timestamp) {
      (result as any)[key] = data[key].toDate();
    }
  });

  return result;
};

/**
 * Fetches all milestones from Firestore
 * @returns Array of milestone objects
 */
export const fetchMilestones = async (): Promise<Milestone[]> => {
  try {
    const milestonesRef = collection(db, 'milestones');
    const milestonesQuery = query(milestonesRef, orderBy('order', 'asc'));
    const milestonesSnapshot = await getDocs(milestonesQuery);
    
    return milestonesSnapshot.docs.map(doc => convertDoc<Milestone>(doc));
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
};

/**
 * Fetches all tasks for a milestone from Firestore
 * @param milestoneId - ID of the milestone
 * @returns Array of task objects
 */
export const fetchTasks = async (milestoneId?: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    let tasksQuery;
    
    if (milestoneId) {
      tasksQuery = query(
        tasksRef, 
        where('milestoneId', '==', milestoneId),
        orderBy('order', 'asc')
      );
    } else {
      tasksQuery = query(tasksRef, orderBy('dueDate', 'asc'));
    }
    
    const tasksSnapshot = await getDocs(tasksQuery);
    
    return tasksSnapshot.docs.map(doc => convertDoc<Task>(doc));
  } catch (error) {
    console.error(`Error fetching tasks${milestoneId ? ' for milestone ' + milestoneId : ''}:`, error);
    return [];
  }
};

/**
 * Fetches all AI-generated insights from Firestore
 * @param maxResults - Maximum number of insights to fetch
 * @returns Array of insight objects
 */
export const fetchInsights = async (maxResults = 5): Promise<Insight[]> => {
  try {
    const insightsRef = collection(db, 'insights');
    const insightsQuery = query(
      insightsRef,
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );
    
    const insightsSnapshot = await getDocs(insightsQuery);
    
    return insightsSnapshot.docs.map(doc => convertDoc<Insight>(doc));
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
};

/**
 * Fetches performance metrics from Firestore
 * @returns Object containing performance metrics
 */
export const fetchPerformanceMetrics = async (): Promise<Metric[]> => {
  try {
    const metricsRef = collection(db, 'metrics');
    const metricsQuery = query(metricsRef, orderBy('date', 'asc'));
    const metricsSnapshot = await getDocs(metricsQuery);
    
    return metricsSnapshot.docs.map(doc => convertDoc<Metric>(doc));
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return [];
  }
};

/**
 * Fetches project settings from Firestore
 * @returns Project settings object
 */
export const fetchProjectSettings = async (): Promise<ProjectSettings | null> => {
  try {
    const settingsDoc = doc(db, 'settings', 'project');
    const settingsSnapshot = await getDoc(settingsDoc);
    
    if (settingsSnapshot.exists()) {
      return convertDoc<ProjectSettings>(settingsSnapshot);
    } else {
      console.warn('Project settings document not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching project settings:', error);
    return null;
  }
};

/**
 * Fetches all data needed for the dashboard
 * @returns Object containing all dashboard data
 */
export const fetchAllDashboardData = async (): Promise<DashboardData> => {
  try {
    const [milestones, insights, metrics, settings] = await Promise.all([
      fetchMilestones(),
      fetchInsights(),
      fetchPerformanceMetrics(),
      fetchProjectSettings()
    ]);
    
    // Fetch tasks for all milestones
    const tasksPromises = milestones.map(milestone => 
      fetchTasks(milestone.id).then(tasks => ({
        milestoneId: milestone.id,
        tasks
      }))
    );
    
    const tasksResults = await Promise.all(tasksPromises);
    
    // Attach tasks to milestones
    const milestonesWithTasks = milestones.map(milestone => {
      const milestoneWithTasks = { ...milestone };
      const taskResult = tasksResults.find(result => result.milestoneId === milestone.id);
      
      if (taskResult) {
        milestoneWithTasks.tasks = taskResult.tasks;
        milestoneWithTasks.tasksCompleted = taskResult.tasks.filter(task => task.completed).length;
      } else {
        milestoneWithTasks.tasks = [];
        milestoneWithTasks.tasksCompleted = 0;
      }
      
      return milestoneWithTasks;
    });
    
    return {
      milestones: milestonesWithTasks,
      insights,
      metrics,
      settings
    };
  } catch (error) {
    console.error('Error fetching all dashboard data:', error);
    return {
      milestones: [],
      insights: [],
      metrics: [],
      settings: null
    };
  }
}; 