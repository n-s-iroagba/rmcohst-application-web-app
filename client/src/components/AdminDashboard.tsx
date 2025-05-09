import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface Task {
  id: string;
  applicantName: string;
  priority: {
    score: number;
    factors: {
      waitingTime: number;
      documentsComplete: boolean;
      departmentQuota: boolean;
    }
  }
}

interface WorkloadMetric {
  officerId: string;
  name: string;
  assignedCount: number;
  averageProcessingTime: number;
}

export default function AdminDashboard() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);

  const handleBatchProcess = async () => {
    if (selectedApps.length === 0) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/applications/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationIds: selectedApps })
      });
      
      const results = await response.json();
      setBatchResults(results);
      setSelectedApps([]);
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const toggleApplicationSelection = (id: string) => {
    setSelectedApps(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };
  const [loading, setLoading] = useState(true);
  const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([]);
  const [workloadMetrics, setWorkloadMetrics] = useState<WorkloadMetric[]>([]);

  useEffect(() => {
    const fetchPrioritizedTasks = async () => {
      try {
        const response = await fetch('/api/admin/tasks/prioritized');
        const data = await response.json();
        setPrioritizedTasks(data);
      } catch (error) {
        console.error('Error fetching prioritized tasks:', error);
      }
    };

    const fetchWorkloadMetrics = async () => {
      try {
        const response = await fetch('/api/admin/workload/metrics');
        const data = await response.json();
        setWorkloadMetrics(data);
      } catch (error) {
        console.error('Error fetching workload metrics:', error);
      }
    };

    fetchPrioritizedTasks();
    fetchWorkloadMetrics();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Priority Tasks</h2>
          <div className="space-y-4">
            {prioritizedTasks.map(task => (
              <div key={task.id} className="border p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{task.applicantName}</span>
                  <span className="text-blue-600">Score: {task.priority.score}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Waiting time: {task.priority.factors.waitingTime} days</p>
                  <p>Documents: {task.priority.factors.documentsComplete ? 'Complete' : 'Incomplete'}</p>
                  <p>Department quota: {task.priority.factors.departmentQuota ? 'Available' : 'Limited'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Workload Distribution</h2>
          <div className="space-y-4">
            {workloadMetrics.map(metric => (
              <div key={metric.officerId} className="border p-4 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.name}</span>
                  <span className="text-green-600">{metric.assignedCount} tasks</span>
                </div>
                <p className="text-sm text-gray-600">
                  Avg. processing time: {metric.averageProcessingTime} hours
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}