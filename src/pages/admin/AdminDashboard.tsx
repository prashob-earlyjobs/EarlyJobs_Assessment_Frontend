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
import { Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/context/AdminContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddFranchise, setShowAddFranchise] = useState(false);
  const { currentUser, setCurrentUser } = useAdmin();

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


  const handleAddFranchise = (franchise) => {
    console.log('New franchise added:', franchise);
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
        console.error('Clipboard error:', err);
      });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Invite Link</CardTitle>
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
            <p className="text-sm text-gray-500">Share this link with potential franchise partners to invite them to sign up.</p>
          </CardContent>
        </Card>
        <DashboardStats stats={stats} />

      </div>

      <AddAssessmentModal
        open={showAddAssessment}
        onOpenChange={setShowAddAssessment}
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