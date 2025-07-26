import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

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

  // Обновляем таймер каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(prev => prev.map(project => ({ ...project })));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getCurrentTime = (project: Project) => {
    if (project.isActive && project.startTime) {
      const currentDuration = Math.floor((Date.now() - project.startTime) / 1000);
      return project.timeSpent + currentDuration;
    }
    return project.timeSpent;
  };

  const totalTimeToday = timeEntries
    .filter(entry => new Date(entry.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, entry) => sum + entry.duration, 0);

  const activeProject = projects.find(p => p.isActive);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracker</h1>
            <p className="text-gray-600 mt-1">Отслеживайте время и достигайte целей</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Icon name="Clock" size={16} className="mr-1" />
              Сегодня: {formatDuration(totalTimeToday)}
            </Badge>
            

          </div>
        </div>

        {/* Active Timer */}
        {activeProject && (
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
        )}

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

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Управление проектами</h2>
                <p className="text-gray-600">Создавайте, редактируйте и удаляйте проекты</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить проект
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
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Введите название..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Input
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Краткое описание проекта..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal">Цель (часов в день)</Label>
                      <Input
                        id="goal"
                        type="number"
                        value={newProject.goalTime}
                        onChange={(e) => setNewProject(prev => ({ ...prev, goalTime: parseInt(e.target.value) || 8 }))}
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const currentTime = getCurrentTime(project);
                const progress = Math.min((currentTime / project.goalTime) * 100, 100);
                
                return (
                  <Card key={project.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${project.color}`} />
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icon name="MoreHorizontal" size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditProject(project)}>
                              <Icon name="Edit" size={16} className="mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteProjectId(project.id)}
                              className="text-red-600"
                            >
                              <Icon name="Trash2" size={16} className="mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Цель в день</span>
                          <span className="text-sm font-bold text-blue-600">
                            {formatDuration(project.goalTime)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Потрачено времени</span>
                          <span className="text-sm font-bold text-green-600">
                            {formatDuration(currentTime)}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Прогресс</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => startEditProject(project)}
                          className="flex-1"
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setDeleteProjectId(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {projects.length === 0 && (
                <div className="col-span-full">
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Icon name="FolderPlus" size={48} className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет проектов</h3>
                      <p className="text-gray-500 mb-4 text-center">
                        Создайте свой первый проект для отслеживания времени
                      </p>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Icon name="Plus" size={16} className="mr-2" />
                            Создать проект
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Статистика за сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatDuration(totalTimeToday)}
                      </div>
                      <div className="text-sm text-gray-600">Всего времени</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {timeEntries.filter(entry => 
                          new Date(entry.startTime).toDateString() === new Date().toDateString()
                        ).length}
                      </div>
                      <div className="text-sm text-gray-600">Сессий</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Target" size={20} />
                    Progress по целям
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects.map(project => {
                    const currentTime = getCurrentTime(project);
                    const progress = Math.min((currentTime / project.goalTime) * 100, 100);
                    
                    return (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${project.color}`} />
                            <span>{project.name}</span>
                          </div>
                          <span className="font-medium">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" size={20} />
                    Последние сессии
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeEntries.slice(-10).reverse().map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon name="Circle" size={8} className="text-blue-500" />
                          <div>
                            <div className="font-medium">{entry.projectName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(entry.startTime).toLocaleTimeString('ru-RU', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(entry.endTime).toLocaleTimeString('ru-RU', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatDuration(entry.duration)}
                        </Badge>
                      </div>
                    ))}
                    {timeEntries.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Icon name="Clock" size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Пока нет записей времени</p>
                        <p className="text-sm">Запустите таймер для первого проекта!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>

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
    </div>
  );
}