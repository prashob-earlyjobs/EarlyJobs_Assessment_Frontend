
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Settings } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export const AdminHeader: React.FC = () => {
  const { currentUser } = useAdmin();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-gray-900">
          EarlyJobs Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
