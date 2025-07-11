
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AddFranchiseModal } from '@/components/admin/AddFranchiseModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, MapPin, Phone, Mail, Plus } from 'lucide-react';
import { getFranchises } from '@/components/services/servicesapis';

const FranchisesPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for franchises
  const [mockFranchises, setMockFranchises] = useState([]);

  const handleAddFranchise = (newFranchise) => {
    setMockFranchises([...mockFranchises, newFranchise]);
  };
  useEffect(() => {
    const fetchFranchises = async () => {
      try{
        const response = await getFranchises();
        
        setMockFranchises(response);

      }
      catch(error){
        console.error('Error fetching franchises:', error);
      }
    }
    fetchFranchises();
  }, [showAddModal]);


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

        {mockFranchises?.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          { mockFranchises?.map((franchise) => (
            <Card key={franchise._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{franchise.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {
                        franchise?.location?.street &&
                        franchise?.location?.city &&
                        franchise?.location?.state &&
                        franchise?.location?.zipCode ?`
                      ${franchise?.location?.street}, ${franchise?.location.city}, ${franchise?.location.state}, ${franchise?.location.zipCode}` : 'N/A'
                      }
                    </CardDescription>
                  </div>
                  <Badge variant={franchise.status  ? 'default' : 'secondary'}>
                    {franchise?.status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {franchise?.contactEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {franchise?.contactPhone}
                  </div>
                </div>

                <div className="gap-4 pt-2 border-t">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-sm text-gray-500">Active Users</p>
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-lg">{franchise?.activeUsers}</span>
                    </div>
                  </div>

                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(franchise?.joinDate).toLocaleDateString()}
                  </p>
                </div>

              </CardContent>
            </Card>
          )) }</div>: <div className="text-center flex items-center justify-center h-[40vh]"> <p className="text-gray-600 text-lg font-semibold">No franchises found</p></div>
        }
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
