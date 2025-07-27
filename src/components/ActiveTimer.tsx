import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  timeSpent: number;
  goalTime: number;
  isActive: boolean;
  startTime?: number;
}

interface ActiveTimerProps {
  activeProject: Project;
  formatTime: (seconds: number) => string;
  getCurrentTime: (project: Project) => number;
  toggleTimer: (projectId: string) => void;
}

export default function ActiveTimer({ 
  activeProject, 
  formatTime, 
  getCurrentTime, 
  toggleTimer 
}: ActiveTimerProps) {
  if (!activeProject) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${activeProject.color} animate-pulse`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{activeProject.name}</h3>
              <p className="text-gray-600">{activeProject.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-blue-600">
              {formatTime(getCurrentTime(activeProject))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleTimer(activeProject.id)}
              className="mt-2"
            >
              <Icon name="Pause" size={16} className="mr-1" />
              Стоп
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}