
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart,
  Users,
  User,
  Calendar,
  Settings,
  Repeat
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: BarChart,
    permission: 'view_analytics'
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
    permission: 'view_all_users'
  },
  {
    title: 'Candidates',
    url: '/admin/candidates',
    icon: User,
    permission: 'view_candidates'
  },
  {
    title: 'Assessments',
    url: '/admin/assessments',
    icon: Calendar,
    permission: 'manage_assessments'
  },
  {
    title: 'Franchises',
    url: '/admin/franchises',
    icon: Users,
    permission: 'manage_franchises'
  },
  {
    title: 'Transactions',
    url: '/admin/transactions',
    icon: Repeat,
    permission: 'candidate_transactions'
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
    permission: 'system_settings'
  },
];

export const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasPermission } = useAdmin();

  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const filteredItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white border-r">
        <div className={`p-6 ${isCollapsed ? 'p-[8px] pt-[18px]' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3`} >
            <img
              src="/lovable-uploads/logo.png"
              alt="EarlyJobs"
              className={`${isCollapsed ? 'w-[3rem] h-8' : 'w-10 h-10'} object-contain`}
            />
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-900">EarlyJobs</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={`${isCollapsed ? 'items-center' : ''}`}>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive(item.url)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
