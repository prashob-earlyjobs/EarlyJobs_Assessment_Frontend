
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/UserManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { User } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { setUserStatusAactivity } from '@/components/services/servicesapis';

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  // Mock data - in real app this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'candidate',
      registrationDate: '2024-01-15',
      isActive: false,
      location: 'New York',
    },

  ]);

  const handleEditUser = (user: User) => {
    // In real app, open edit modal or navigate to edit page
    toast({
      title: "Edit User",
      description: `Opening edit form for ${user.name}`,
    });
  };

  const handleToggleUserStatus = async (userId: string, role: string, newStatus: boolean) => {
    if (role === 'super_admin' || role === 'franchise_admin') {
      return toast({
        title: "Error",
        description: `Cannot change status of ${role}`,
      });
    }

    try {
      const response = await setUserStatusAactivity(userId, newStatus);
      if (!response.success) {
        throw new Error(response.message);
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: response.data.user.isActive } : user
        )
      );

    }
    catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later"
      });

      return;
    }


    const user = users.find(u => u._id === userId);
    toast({
      title: "User Status Updated",
      description: `${user?.name} has been ${newStatus ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">Manage all platform users and their access.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <UserManagement
          users={users}
          setUsers={setUsers}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
