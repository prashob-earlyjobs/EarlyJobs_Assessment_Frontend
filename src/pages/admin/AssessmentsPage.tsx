import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AddAssessmentModal } from '@/components/admin/AddAssessmentModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash, BarChart } from 'lucide-react';
import { Assessment } from '@/types/admin';
import { addAssessment, editAssessment, getAssessmentsfromAdminSearch } from '@/components/services/servicesapis';
import { toast } from 'sonner';

import EditAssessmentModal from '@/components/admin/EditAssessmentModal';
import { useAdmin } from '@/context/AdminContext';

const LIMIT = 10;

const AssessmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { currentUser } = useAdmin();


  const lastAssessmentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: LIMIT,
          type: '',
          searchQuery: searchTerm,
        };
        const response = await getAssessmentsfromAdminSearch(params);
        const fetched = response.data.assessments;

        setAssessments(prev => {
          // For page 1, replace the assessments; for others, append
          if (page === 1) return fetched;
          return [...prev, ...fetched];
        });
        setHasMore(fetched.length === LIMIT);
      } catch (err) {
        console.error('Failed to fetch assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [page, searchTerm]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
    setAssessments([]);
    setHasMore(true);
  }, [searchTerm]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAssessment = async (newAssessment) => {
    console.log('New assessment added:', newAssessment);
    try {
      const response = await addAssessment(newAssessment);
      if (!response.success) {
        throw new Error(response.message);
      }
      console.log('Assessment added successfully:', response.data);
      toast.success('Assessment added successfully!');

    }
    catch (error) {
      toast.error('Failed to add assessment: ' + error.message);
      return;
    }
    // setAssessments(prev => [...prev, newAssessment]);

    setShowAddModal(false);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowEditModal(true);
  };

  const handleUpdateAssessment = async (updatedAssessment: Assessment) => {
    console.log('Updating assessment:', updatedAssessment, selectedAssessment._id);
    if (!selectedAssessment._id) return toast.error('This assessment does not exist.');
    try {
      const response = await editAssessment(
        updatedAssessment,
        selectedAssessment._id
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      setAssessments(prev =>
        prev.map(a => (a._id === response.data._id ? response.data : a))
      );
      toast.success('Assessment updated successfully!');
      setShowEditModal(false);
      setSelectedAssessment(null);
    } catch (error) {
      toast.error(`Failed to update assessment: ${error.message}`);
    }
  };


  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments(prev => prev.filter(a => a.id !== assessmentId));
    setDeleteConfirmId(null);
  };

  const handleViewAnalytics = (assessment: Assessment) => {
    console.log('View analytics for:', assessment);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600 mt-2">Create and manage skill assessments for candidates.</p>
          </div>
          {
            currentUser.role === 'super_admin' &&
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          }
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Assessments</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.map((assessment, index) => {
                const isLast = index === assessments.length - 1;
                return (
                  <div
                    key={assessment.id}
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                    ref={isLast ? lastAssessmentRef : null}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                          <Badge className={getDifficultyColor(assessment.difficulty)}>
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{assessment.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {assessment?.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAnalytics(assessment)}
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAssessment(assessment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(assessment.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{assessment.timeLimit}</p>
                        <p className="text-sm text-gray-500">Minutes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{assessment.questions.length}</p>
                        <p className="text-sm text-gray-500">Questions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{assessment.attempts}</p>
                        <p className="text-sm text-gray-500">Attempts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{assessment.averageScore}%</p>
                        <p className="text-sm text-gray-500">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-gray-900">{assessment.completionRate}%</p>
                        <p className="text-sm text-gray-500">Completion</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {loading && <div className="text-center py-4">Loading...</div>}
              {!hasMore && assessments.length > 0 && (
                <div className="text-center py-4 text-gray-500">No more assessments to load</div>
              )}
              {!loading && assessments.length === 0 && (
                <div className="text-center py-4 text-gray-500">No assessments found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddAssessmentModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddAssessment}

      />
      <EditAssessmentModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleUpdateAssessment}
        initialData={selectedAssessment}
      />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assessment
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmId && handleDeleteAssessment(deleteConfirmId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AssessmentsPage;