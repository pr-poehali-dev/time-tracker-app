import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ProjectsTabProps {
  paginatedProjects: Project[];
  currentPage: number;
  totalPages: number;
  indexOfFirstProject: number;
  indexOfLastProject: number;
  projects: Project[];
  formatTime: (seconds: number) => string;
  formatDuration: (seconds: number) => string;
  getCurrentTime: (project: Project) => number;
  toggleTimer: (projectId: string) => void;
  startEditProject: (project: Project) => void;
  setDeleteProjectId: (id: string | null) => void;
  prevPage: () => void;
  nextPage: () => void;
  newProject: { name: string; description: string; goalTime: number };
  setNewProject: (project: { name: string; description: string; goalTime: number }) => void;
  addProject: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export default function ProjectsTab({
  paginatedProjects,
  currentPage,
  totalPages,
  indexOfFirstProject,
  indexOfLastProject,
  projects,
  formatTime,
  formatDuration,
  getCurrentTime,
  toggleTimer,
  startEditProject,
  setDeleteProjectId,
  prevPage,
  nextPage,
  newProject,
  setNewProject,
  addProject,
  isDialogOpen,
  setIsDialogOpen
}: ProjectsTabProps) {
  return (
    <TabsContent value="projects" className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление проектами</h2>
          <p className="text-gray-600">Создавайте, редактируйте и удаляйте проекты</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={18} className="mr-2" />
              Новый проект
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый проект</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название проекта</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Введите название..."
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Краткое описание проекта..."
                />
              </div>
              <div>
                <Label htmlFor="goal">Цель (часов в день)</Label>
                <Input
                  id="goal"
                  type="number"
                  value={newProject.goalTime}
                  onChange={(e) => setNewProject({ ...newProject, goalTime: parseInt(e.target.value) || 8 })}
                  min="1"
                  max="24"
                />
              </div>
              <Button onClick={addProject} className="w-full">
                Создать проект
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FolderPlus" size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет проектов</h3>
          <p className="text-gray-600 mb-6">Создайте первый проект для начала отслеживания времени</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать проект
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => {
              const currentTime = getCurrentTime(project);
              const progress = Math.min((currentTime / project.goalTime) * 100, 100);
              
              return (
                <Card key={project.id} className={`${project.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${project.color} ${project.isActive ? 'animate-pulse' : ''}`} />
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEditProject(project)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteProjectId(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-gray-900">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Цель: {formatDuration(project.goalTime)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-gray-500 text-center">
                        {progress.toFixed(0)}% от цели
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => toggleTimer(project.id)}
                      className={`w-full ${project.isActive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      <Icon 
                        name={project.isActive ? "Pause" : "Play"} 
                        size={16} 
                        className="mr-2" 
                      />
                      {project.isActive ? 'Остановить' : 'Запустить'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {projects.length > 6 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                Показано {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} из {projects.length} проектов
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <Icon name="ChevronLeft" size={16} className="mr-1" />
                  Назад
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {/* setCurrentPage logic would be here */}}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Вперёд
                  <Icon name="ChevronRight" size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </TabsContent>
  );
}