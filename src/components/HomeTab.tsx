import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
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

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface HomeTabProps {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  formatTime: (seconds: number) => string;
  formatDuration: (seconds: number) => string;
  getCurrentTime: (project: Project) => number;
  toggleTimer: (projectId: string) => void;
  totalTimeToday: number;
  timeEntries: TimeEntry[];
}

export default function HomeTab({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  formatTime,
  formatDuration,
  getCurrentTime,
  toggleTimer,
  totalTimeToday,
  timeEntries
}: HomeTabProps) {
  return (
    <TabsContent value="home" className="space-y-6">
      <div className="max-w-2xl mx-auto">
        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Выберите проект для отслеживания времени</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите проект..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      <span>{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="FolderPlus" size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Нет проектов</p>
                <p className="text-sm">Создайте первый проект для отслеживания времени</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timer Section */}
        {selectedProjectId && (() => {
          const selectedProject = projects.find(p => p.id === selectedProjectId);
          if (!selectedProject) return null;
          
          const currentTime = getCurrentTime(selectedProject);
          const progress = Math.min((currentTime / selectedProject.goalTime) * 100, 100);
          
          return (
            <Card className={`${selectedProject.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${selectedProject.color} ${selectedProject.isActive ? 'animate-pulse' : ''}`} />
                  <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                </div>
                <p className="text-gray-600">{selectedProject.description}</p>
                {selectedProject.isActive && (
                  <Badge className="mx-auto bg-green-100 text-green-800">
                    <Icon name="Circle" size={8} className="mr-1 animate-pulse" />
                    Запущен
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Timer Display */}
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                    {formatTime(currentTime)}
                  </div>
                  <p className="text-gray-500">Время работы над проектом</p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс к цели на сегодня</span>
                    <span className="font-medium">
                      {formatDuration(currentTime)} / {formatDuration(selectedProject.goalTime)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="text-center text-sm text-gray-500">
                    {progress >= 100 ? '🎉 Цель достигнута!' : `${progress.toFixed(0)}% от цели`}
                  </div>
                </div>
                
                {/* Timer Controls */}
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => toggleTimer(selectedProject.id)}
                    size="lg"
                    className={`px-8 ${selectedProject.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Icon 
                      name={selectedProject.isActive ? "Pause" : "Play"} 
                      size={20} 
                      className="mr-2" 
                    />
                    {selectedProject.isActive ? 'Остановить' : 'Запустить'}
                  </Button>
                  
                  {currentTime > 0 && (
                    <Button variant="outline" size="lg" className="px-6">
                      <Icon name="RotateCcw" size={18} className="mr-2" />
                      Сбросить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })()}
        
        {/* Quick Stats */}
        {selectedProjectId && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(totalTimeToday)}
                </div>
                <div className="text-sm text-gray-600">Всего сегодня</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {timeEntries.filter(entry => 
                    new Date(entry.startTime).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Сессий сегодня</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TabsContent>
  );
}