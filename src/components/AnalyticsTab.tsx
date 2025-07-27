import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface AnalyticsTabProps {
  timeEntries: TimeEntry[];
  totalTimeToday: number;
  formatDuration: (seconds: number) => string;
}

export default function AnalyticsTab({
  timeEntries,
  totalTimeToday,
  formatDuration
}: AnalyticsTabProps) {
  const todaysEntries = timeEntries.filter(entry => 
    new Date(entry.startTime).toDateString() === new Date().toDateString()
  );

  const sessionsToday = todaysEntries.length;
  
  const avgSessionDuration = sessionsToday > 0 
    ? Math.floor(totalTimeToday / sessionsToday) 
    : 0;

  const projectStats = todaysEntries.reduce((acc, entry) => {
    if (!acc[entry.projectName]) {
      acc[entry.projectName] = { duration: 0, sessions: 0 };
    }
    acc[entry.projectName].duration += entry.duration;
    acc[entry.projectName].sessions += 1;
    return acc;
  }, {} as Record<string, { duration: number; sessions: number }>);

  const topProjects = Object.entries(projectStats)
    .sort(([,a], [,b]) => b.duration - a.duration)
    .slice(0, 5);

  return (
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
                  {sessionsToday}
                </div>
                <div className="text-sm text-gray-600">Сессий</div>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(avgSessionDuration)}
              </div>
              <div className="text-sm text-gray-600">Средняя продолжительность сессии</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Топ проектов сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProjects.length > 0 ? (
              <div className="space-y-3">
                {topProjects.map(([projectName, stats], index) => (
                  <div key={projectName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{projectName}</div>
                        <div className="text-sm text-gray-600">
                          {stats.sessions} сессий
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatDuration(stats.duration)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Icon name="BarChart3" size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Нет данных</p>
                <p className="text-sm">Начните отслеживать время для просмотра статистики</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={20} />
            История сегодня
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysEntries.length > 0 ? (
            <div className="space-y-3">
              {todaysEntries
                .sort((a, b) => b.startTime - a.startTime)
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name="Play" size={16} className="text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">{entry.projectName}</div>
                        <div className="text-sm text-gray-600">
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
                    <div className="font-semibold text-gray-900">
                      {formatDuration(entry.duration)}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Clock" size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Нет записей</p>
              <p className="text-sm">Запустите таймер для начала отслеживания времени</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}