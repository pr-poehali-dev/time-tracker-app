import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

interface AuthPanelProps {
  totalTimeToday: number;
  formatDuration: (seconds: number) => string;
}

export default function AuthPanel({ totalTimeToday, formatDuration }: AuthPanelProps) {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="secondary" className="text-sm px-3 py-1">
        <Icon name="Clock" size={16} className="mr-1" />
        Сегодня: {formatDuration(totalTimeToday)}
      </Badge>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm">
        <Icon name="User" size={20} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Иван Петров</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Icon name="Settings" size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Icon name="User" size={16} className="mr-2" />
            Профиль
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="Settings" size={16} className="mr-2" />
            Настройки
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}