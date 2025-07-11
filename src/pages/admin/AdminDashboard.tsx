import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AddAssessmentModal } from '@/components/admin/AddAssessmentModal';
import { AddFranchiseModal } from '@/components/admin/AddFranchiseModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats as Stats } from '@/types/admin';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy, Users, FileText, Building2, UserPlus, Plus, ArrowRight, CreditCard, Gift } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/context/AdminContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddFranchise, setShowAddFranchise] = useState(false);
  const { currentUser, setCurrentUser } = useAdmin();


  // Check if user is franchise admin
  const isFranchiseAdmin = currentUser?.role === "franchise_admin";

  // Mock data - in real app this would come from API
  const stats: Stats = {
    totalUsers: 1248,
    activeUsers: 986,
    totalAssessments: 45,
    assessmentsTaken: 3421,
    franchiseCount: 12,
    averageScore: 78,
  };

  // Franchise admin actions (only 3 items)
  const franchiseActions = [
    {
      title: 'Candidates',
      description: 'View and manage candidates',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => navigate('/admin/candidates'),
    },
    {
      title: 'Assessments',
      description: 'View available assessments',
      icon: FileText,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => navigate('/admin/assessments'),
    },
    {
      title: 'Transactions',
      description: 'View payment transactions',
      icon: CreditCard,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => navigate('/admin/transactions'),
    },
  ];

  // Super admin actions (all 6 items)
  const adminActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Assessments',
      description: 'Create and manage assessments',
      icon: FileText,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => navigate('/admin/assessments'),
    },
    {
      title: 'Franchises',
      description: 'Manage franchise partners',
      icon: Building2,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => navigate('/admin/franchises'),
    },
    {
      title: 'Transactions',
      description: 'View payment transactions',
      icon: CreditCard,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => navigate('/admin/transactions'),
    },
    {
      title: 'Offers',
      description: 'Manage promotional offers',
      icon: Gift,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      onClick: () => navigate('/admin/offers'),
    },
    {
      title: 'Add User',
      description: 'Create new user account',
      icon: UserPlus,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
      onClick: () => navigate('/admin/users/add'),
    },
  ];

  // Choose actions based on user role
  const quickActions = isFranchiseAdmin ? franchiseActions : adminActions;

  const recentActivity = [
    { id: 1, type: 'assessment', message: 'New assessment "React Developer" created', time: '2 hours ago' },
    { id: 2, type: 'user', message: 'John Doe completed Python Assessment', time: '3 hours ago' },
    { id: 3, type: 'franchise', message: 'TechCorp franchise registered', time: '5 hours ago' },
    { id: 4, type: 'assessment', message: 'Sarah Smith scored 95% in Java Assessment', time: '6 hours ago' },
  ];


  const handleAddFranchise = (franchise) => {
    // In real app, this would make an API call
  };

  const inviteLink = `https://earlyjobs.ai/signup/${currentUser?.franchiseId || ''}`;
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toast.success('Invite link copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy invite link.');
      });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isFranchiseAdmin ? 'Franchise Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isFranchiseAdmin
              ? 'Manage your candidates, assessments, and transactions.'
              : 'Welcome back! Here\'s what\'s happening with your platform.'
            }
          </p>
        </div>

        {/* Statistics Cards - Show for both */}
        {/* <DashboardStats stats={stats} /> */}

        {/* Invite Link Card - Show for both admin and franchise */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {isFranchiseAdmin ? 'Candidate Invite Link' : 'Invite Link'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 bg-gray-50 border-gray-200 rounded-lg text-sm"
              />
              <Button
                onClick={handleCopyToClipboard}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              {isFranchiseAdmin
                ? 'Share this link with candidates to invite them to take assessments through your franchise.'
                : 'Share this link with potential franchise partners to invite them to sign up.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              {isFranchiseAdmin ? 'Franchise Actions' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFranchiseAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} gap-4`}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    onClick={action.onClick}
                    className="group cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} ${action.hoverColor} transition-colors`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Show for both */}
        {/* <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'assessment' ? 'bg-purple-100 text-purple-700' :
                    activity.type === 'user' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

      </div>

      {/* Only show admin modals for super admins */}
      {!isFranchiseAdmin && (
        <>
          <AddAssessmentModal
            open={showAddAssessment}
            onOpenChange={setShowAddAssessment}
          />

          <AddFranchiseModal
            open={showAddFranchise}
            onOpenChange={setShowAddFranchise}
            onSave={handleAddFranchise}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;