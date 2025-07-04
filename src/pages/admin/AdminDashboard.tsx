
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AddAssessmentModal } from '@/components/admin/AddAssessmentModal';
import { AddFranchiseModal } from '@/components/admin/AddFranchiseModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats as Stats } from '@/types/admin';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddFranchise, setShowAddFranchise] = useState(false);

  // Mock data - in real app this would come from API
  const stats: Stats = {
    totalUsers: 1248,
    activeUsers: 986,
    totalAssessments: 45,
    assessmentsTaken: 3421,
    franchiseCount: 12,
    averageScore: 78,
  };

  const recentActivity = [
    { id: 1, type: 'assessment', message: 'New assessment "React Developer" created', time: '2 hours ago' },
    { id: 2, type: 'user', message: 'John Doe completed Python Assessment', time: '3 hours ago' },
    { id: 3, type: 'franchise', message: 'TechCorp franchise registered', time: '5 hours ago' },
    { id: 4, type: 'assessment', message: 'Sarah Smith scored 95% in Java Assessment', time: '6 hours ago' },
  ];

  const handleAddAssessment = (assessment) => {
    console.log('New assessment created:', assessment);
    // In real app, this would make an API call
  };

  const handleAddFranchise = (franchise) => {
    console.log('New franchise added:', franchise);
    // In real app, this would make an API call
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'assessment' ? 'bg-blue-500' :
                        activity.type === 'user' ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowAddAssessment(true)}
                  className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Add Assessment</div>
                  <div className="text-sm text-gray-500 mt-1">Create new assessment</div>
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Add User</div>
                  <div className="text-sm text-gray-500 mt-1">Register new user</div>
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-500 mt-1">Analytics & reports</div>
                </button>
                <button
                  onClick={() => setShowAddFranchise(true)}
                  className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Manage Franchises</div>
                  <div className="text-sm text-gray-500 mt-1">Franchise settings</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddAssessmentModal
        open={showAddAssessment}
        onOpenChange={setShowAddAssessment}
        onSave={handleAddAssessment}
      />

      <AddFranchiseModal
        open={showAddFranchise}
        onOpenChange={setShowAddFranchise}
        onSave={handleAddFranchise}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
