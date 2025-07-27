import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function FooterNavigation() {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-center">
          <div className="flex items-center gap-8">
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 transition-colors"
            >
              <Icon name="Home" size={20} />
              <span className="text-xs font-medium">Главная</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="projects" 
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 transition-colors"
            >
              <Icon name="FolderOpen" size={20} />
              <span className="text-xs font-medium">Проекты</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 transition-colors"
            >
              <Icon name="BarChart3" size={20} />
              <span className="text-xs font-medium">Аналитика</span>
            </TabsTrigger>
          </div>
        </div>
      </div>
    </footer>
  );
}