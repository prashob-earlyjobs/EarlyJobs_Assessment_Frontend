
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AddFranchiseModal } from '@/components/admin/AddFranchiseModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, MapPin, Phone, Mail, Plus } from 'lucide-react';

const FranchisesPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for franchises
  const [mockFranchises, setMockFranchises] = useState([
    // {
    //   id: '1',
    //   name: 'TechCorp Solutions',
    //   contactEmail: 'admin@techcorp.com',
    //   contactPhone: '+1-555-0123',
    //   location: 'New York, NY',
    //   activeUsers: 45,
    //   totalAssessments: 120,
    //   joinDate: '2024-01-15',
    //   status: 'active' as const
    // },
    // {
    //   id: '2',
    //   name: 'Innovation Hub',
    //   contactEmail: 'contact@innovhub.com',
    //   contactPhone: '+1-555-0456',
    //   location: 'San Francisco, CA',
    //   activeUsers: 32,
    //   totalAssessments: 89,
    //   joinDate: '2024-02-20',
    //   status: 'active' as const
    // },
    // {
    //   id: '3',
    //   name: 'StartupBridge',
    //   contactEmail: 'info@startupbridge.com',
    //   contactPhone: '+1-555-0789',
    //   location: 'Austin, TX',
    //   activeUsers: 18,
    //   totalAssessments: 45,
    //   joinDate: '2024-03-10',
    //   status: 'inactive' as const
    // }
  ]);

  const handleAddFranchise = (newFranchise) => {
    setMockFranchises([...mockFranchises, newFranchise]);
  };

  const handleViewDetails = (franchise) => {
    console.log('View franchise details:', franchise);
    // In real app, would open details modal or navigate to details page
  };

  const handleManageUsers = (franchise) => {
    console.log('Manage users for franchise:', franchise);
    // In real app, would navigate to franchise users page
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Franchise Management</h1>
            <p className="text-gray-600 mt-1">Manage franchise partners and their access</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Franchise
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFranchises.map((franchise) => (
            <Card key={franchise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{franchise.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {franchise.location}
                    </CardDescription>
                  </div>
                  <Badge variant={franchise.status === 'active' ? 'default' : 'secondary'}>
                    {franchise.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {franchise.contactEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {franchise.contactPhone}
                  </div>
                </div>

                <div className="gap-4 pt-2 border-t">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-sm text-gray-500">Active Users</p>
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-lg">{franchise.activeUsers}</span>
                    </div>
                  </div>

                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(franchise.joinDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(franchise)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleManageUsers(franchise)}
                  >
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AddFranchiseModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddFranchise}
      />
    </AdminLayout>
  );
};

export default FranchisesPage;
