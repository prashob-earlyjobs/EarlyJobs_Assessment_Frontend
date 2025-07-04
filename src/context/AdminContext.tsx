
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminUser, UserRole } from '@/types/admin';

interface AdminContextType {
  currentUser: AdminUser | null;
  setCurrentUser: (user: AdminUser | null) => void;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // Mock current user - in real app this would come from authentication
  const [currentUser, setCurrentUser] = useState<AdminUser | null>({
    id: '',
    name: '',
    email: '',
    role: 'super_admin'
  });

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;

    const permissions = {
      'super_admin': [
        'view_all_users',
        'view_candidates',
        'manage_users',
        'manage_assessments',
        'manage_franchises',
        'view_analytics',
        'system_settings',
        'candidate_transactions'
      ],
      'franchise_admin': [
        'view_candidates',
        'view_franchise_users',
        'manage_assessments',
        'manage_franchise_candidates',
        'view_franchise_analytics',
        'candidate_transactions'
      ]
    };

    return permissions[currentUser.role]?.includes(permission) || false;
  };

  return (
    <AdminContext.Provider value={{ currentUser, setCurrentUser, hasPermission }}>
      {children}
    </AdminContext.Provider>
  );
};
