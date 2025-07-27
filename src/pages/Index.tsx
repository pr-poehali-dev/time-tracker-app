import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

// Import components
import AuthPanel from '@/components/AuthPanel';
import ActiveTimer from '@/components/ActiveTimer';
import HomeTab from '@/components/HomeTab';
import ProjectsTab from '@/components/ProjectsTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import FooterNavigation from '@/components/FooterNavigation';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  timeSpent: number; // в секундах
  goalTime: number; // в секундах
  isActive: boolean;
  startTime?: number;
}

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  startTime: number;
  endTime: number;
  duration: number; // в секундах
}

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Веб-разработка',
      description: 'Создание нового сайта для клиента',
      color: 'bg-blue-500',
      timeSpent: 14400, // 4 часа
      goalTime: 28800, // 8 часов
      isActive: false
    },
    {
      id: '2', 
      name: 'Дизайн проект',
      description: 'Работа над макетами мобильного приложения',
      color: 'bg-purple-500',
      timeSpent: 7200, // 2 часа
      goalTime: 21600, // 6 часов
      isActive: false
    },
    {
      id: '3',
      name: 'Изучение React',
      description: 'Курс по современной разработке',
      color: 'bg-green-500',
      timeSpent: 3600, // 1 час
      goalTime: 18000, // 5 часов
      isActive: false
    }
  ]);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', goalTime: 8 });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  const toggleTimer = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        if (project.isActive) {
          // Останавливаем таймер
          const duration = Date.now() - (project.startTime || 0);
          const newTimeEntry: TimeEntry = {
            id: Date.now().toString(),
            projectId: project.id,
            projectName: project.name,
            startTime: project.startTime || 0,
            endTime: Date.now(),
            duration: Math.floor(duration / 1000)
          };
          setTimeEntries(prev => [...prev, newTimeEntry]);
          
          return {
            ...project,
            isActive: false,
            timeSpent: project.timeSpent + Math.floor(duration / 1000),
            startTime: undefined
          };
        } else {
          // Запускаем таймер
          return {
            ...project,
            isActive: true,
            startTime: Date.now()
          };
        }
      } else if (project.isActive) {
        // Останавливаем другие активные таймеры
        const duration = Date.now() - (project.startTime || 0);
        const newTimeEntry: TimeEntry = {
          id: Date.now().toString(),
          projectId: project.id,
          projectName: project.name,
          startTime: project.startTime || 0,
          endTime: Date.now(),
          duration: Math.floor(duration / 1000)
        };
        setTimeEntries(prev => [...prev, newTimeEntry]);
        
        return {
          ...project,
          isActive: false,
          timeSpent: project.timeSpent + Math.floor(duration / 1000),
          startTime: undefined
        };
      }
      return project;
    }));
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        color: randomColor,
        timeSpent: 0,
        goalTime: newProject.goalTime * 3600, // конвертируем часы в секунды
        isActive: false
      };
      
      setProjects(prev => [...prev, project]);
      setNewProject({ name: '', description: '', goalTime: 8 });
      setIsDialogOpen(false);
    }
  };

  const updateProject = () => {
    if (editingProject && editingProject.name.trim()) {
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id 
          ? { ...editingProject, goalTime: editingProject.goalTime * 3600 }
          : p
      ));
      setEditingProject(null);
      setIsEditDialogOpen(false);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTimeEntries(prev => prev.filter(entry => entry.projectId !== projectId));
    setDeleteProjectId(null);
  };

  const startEditProject = (project: Project) => {
    setEditingProject({ ...project, goalTime: Math.floor(project.goalTime / 3600) });
    setIsEditDialogOpen(true);
  };

  const getCurrentTime = (project: Project) => {
    if (project.isActive && project.startTime) {
      const elapsed = Math.floor((Date.now() - project.startTime) / 1000);
      return project.timeSpent + elapsed;
    }
    return project.timeSpent;
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const paginatedProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Обновляем таймер каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(prev => prev.map(project => ({ ...project })));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const totalTimeToday = timeEntries
    .filter(entry => new Date(entry.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, entry) => sum + entry.duration, 0);

  const activeProject = projects.find(p => p.isActive);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="max-w-7xl mx-auto space-y-6 flex-1">
        {/* Header with Auth Panel */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracker</h1>
            <p className="text-gray-600 mt-1">Отслеживайте время и достигайte целей</p>
          </div>
          
          <AuthPanel 
            totalTimeToday={totalTimeToday}
            formatDuration={formatDuration}
          />
        </div>

        {/* Active Timer */}
        <ActiveTimer 
          activeProject={activeProject}
          formatTime={formatTime}
          getCurrentTime={getCurrentTime}
          toggleTimer={toggleTimer}
        />

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Icon name="FolderOpen" size={18} className="mr-2" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <HomeTab 
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            formatTime={formatTime}
            formatDuration={formatDuration}
            getCurrentTime={getCurrentTime}
            toggleTimer={toggleTimer}
            totalTimeToday={totalTimeToday}
            timeEntries={timeEntries}
          />

          <ProjectsTab 
            paginatedProjects={paginatedProjects}
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstProject={indexOfFirstProject}
            indexOfLastProject={indexOfLastProject}
            projects={projects}
            formatTime={formatTime}
            formatDuration={formatDuration}
            getCurrentTime={getCurrentTime}
            toggleTimer={toggleTimer}
            startEditProject={startEditProject}
            setDeleteProjectId={setDeleteProjectId}
            prevPage={prevPage}
            nextPage={nextPage}
            newProject={newProject}
            setNewProject={setNewProject}
            addProject={addProject}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />

          <AnalyticsTab 
            timeEntries={timeEntries}
            totalTimeToday={totalTimeToday}
            formatDuration={formatDuration}
          />

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать проект</DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Название проекта</Label>
                  <Input
                    id="edit-name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Введите название..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Описание</Label>
                  <Input
                    id="edit-description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Краткое описание проекта..."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-goal">Цель (часов в день)</Label>
                  <Input
                    id="edit-goal"
                    type="number"
                    value={editingProject.goalTime}
                    onChange={(e) => setEditingProject(prev => prev ? { ...prev, goalTime: parseInt(e.target.value) || 8 } : null)}
                    min="1"
                    max="24"
                  />
                </div>
                <Button onClick={updateProject} className="w-full">
                  Сохранить изменения
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Проект и вся связанная с ним статистика времени будут удалены навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteProjectId && deleteProject(deleteProjectId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <FooterNavigation />
        </Tabs>
    </div>
  );
}