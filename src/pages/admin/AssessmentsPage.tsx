import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AddAssessmentModal } from '@/components/admin/AddAssessmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Search, Edit, Trash, BarChart, Eye, Copy } from 'lucide-react';
import { Assessment } from '@/types/admin';
import { addAssessment, editAssessment, getAssessmentsfromAdminSearch, getCandidatesForAssessment, getResultForCandidateAssessment,getRecording, getTranscript } from '@/components/services/servicesapis';
import { toast } from 'sonner';
import EditAssessmentModal from '@/components/admin/EditAssessmentModal';
import { CandidateDetailsModal } from '@/components/admin/CandidateDetailsModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUsers, getUsersForFranchise } from '@/components/services/servicesapis';
import { useAdmin } from '@/context/AdminContext';
import UserDetailSidebar from '@/components/UserDetailSidebar';
import { a } from 'node_modules/framer-motion/dist/types.d-D0HXPxHm';
import UserResultsSidebar from '@/components/userResultSidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Clock,
  CalendarDays,
  Link2,
  RefreshCcw,
  Code, BookOpen
} from "lucide-react";


const LIMIT = 10;

const AssessmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssessmentForEdit, setSelectedAssessmentForEdit] = useState<Assessment | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [page, setPage] = useState(1);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { currentUser } = useAdmin();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [result, setResult] = useState(null);
  const [recording, setRecording] = useState(null);
  const[transcript, setTranscript] = useState([]);

  useEffect(() => {
    const resetSearchAndFilter = async () => {
      try {
        if (!selectedAssessment?.assessmentId) {
          setCandidates([]);
          return;
        }
        const response = await getCandidatesForAssessment(selectedAssessment.assessmentId);
        if (!response.success) {
          throw new Error(response.message);
        }
        setAssessment(response.data || []);
        setCandidates(response.data.interviewCandidates || []);
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
        setCandidates([]);
      }
    };

    resetSearchAndFilter();
  }, [selectedAssessment, searchTerm]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleViewDetails = async (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
    const response = await getResultForCandidateAssessment(candidate.interviewId);
    setResult(response);
    const recordingResponse = await getRecording(candidate.interviewId);
    console.log("recordingResponse", recordingResponse);
    if (!recordingResponse.success) {
      throw new Error(recordingResponse.message);
    }
    setRecording(recordingResponse.data);
    const transcriptResponse = await getTranscript(candidate.interviewId);
    if (!transcriptResponse.success) {
      throw new Error(transcriptResponse.message);
    }
    console.log("transcriptResponse", transcriptResponse.data);
    setTranscript(transcriptResponse.data);

    
  };

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
          if (page === 1) return fetched;
          return [...prev, ...fetched];
        });
        setHasMore(fetched.length === LIMIT);
      } catch (err) {
        toast.error("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [page, searchTerm]);

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
 const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'mcq':
      return 'bg-blue-100 text-blue-800'; // Blue for MCQ
    case 'coding':
      return 'bg-purple-100 text-purple-800'; // Purple for coding
    case 'video':
      return 'bg-orange-100 text-orange-800'; // Orange for video
    case 'mixed':
      return 'bg-teal-100 text-teal-800'; // Teal for mixed
    default:
      return 'bg-gray-100 text-gray-800'; // Default fallback
  }
};
  const handleCopyToClipboard = (assessment) => {
    const title = assessment?.title.replace(/\s+/g, '-').toLowerCase();
  const inviteLink = `https://earlyjobs.ai/assessment/${title}/${assessment.shortId ? assessment.shortId : assessment._id}/${currentUser.role ==='franchise_admin'? currentUser.franchiseId:""}`;

    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toast.success('Invite link copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy invite link.');
      });
  };
  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessmentForEdit(assessment);
    setShowEditModal(true);
  };

  const handleUpdateAssessment = async (updatedAssessment: Assessment) => {
    if (!selectedAssessmentForEdit?._id) return toast.error('This assessment does not exist.');
    try {
      const response = await editAssessment(updatedAssessment, selectedAssessmentForEdit._id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setAssessments(prev =>
        prev.map(a => (a._id === response.data._id ? response.data : a))
      );
      toast.success('Assessment updated successfully!');
      setShowEditModal(false);
      setSelectedAssessmentForEdit(null);
    } catch (error) {
      toast.error(`Failed to update assessment: ${error.message}`);
    }
  };



  const handleViewAnalytics = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600 mt-2">Create and manage skill assessments for candidates.</p>
          </div>
          {currentUser.role === 'super_admin' && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          )}
        </div>

        {!selectedAssessment && (
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
                      key={assessment._id}
                      className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                      ref={isLast ? lastAssessmentRef : null}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getDifficultyColor(assessment.difficulty)}>
                              {assessment.difficulty}
                            </Badge>
                             <Badge className={getTypeColor(assessment.type)}>
                              {assessment.type?.toUpperCase()}
                            </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md 
                                  ${assessment.category === 'technical'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-yellow-100 text-yellow-800 border-yellow-300'}
                                `}
                              >
                                {assessment.category === 'technical' ? (
                                  <Code className="w-3.5 h-3.5" />
                                ) : (
                                  <BookOpen className="w-3.5 h-3.5" />
                                )}
                                {assessment.category==='technical' ? 'Technical' : 'Non-Technical'}
                              </Badge>
                          </div>
                            {assessment?.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          <Tooltip>
                        <TooltipTrigger asChild>
                          <CardDescription className="text-sm text-gray-600 mt-3 max-h-[64px] leading-snug line-clamp-3 cursor-default">
                            {assessment.description}
                          </CardDescription>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm text-gray-600">
                          {assessment.description}
                        </TooltipContent>
                        </Tooltip>                          <div className="flex flex-wrap gap-2">
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                         {
                          currentUser.role === 'super_admin' &&
                           <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleViewAnalytics(assessment)}
                           >
                            <BarChart className="h-4 w-4" />
                          </Button>
                          }
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
                            onClick={() => handleCopyToClipboard(assessment)}
                          >
                          <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">{assessment.timeLimit}</p>
                          <p className="text-sm text-gray-500">Minutes</p>
                        </div>
                       
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">{assessment.pricing.basePrice}<span className="text-sm text-gray-500">Rs</span></p>
                          <p className="text-sm text-gray-500">Base Price</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900">{assessment.pricing.discountedPrice}<span className="text-sm text-gray-500">Rs</span></p>
                          <p className="text-sm text-gray-500">Discounted Price</p>
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
        )}
        {selectedAssessment && (
          <Card>
            <CardHeader>
              <Button
                onClick={() => setSelectedAssessment(null)}
                className="w-12 bg-gray-600 hover:bg-gray-700"
              >
                Back
              </Button>
              <div className="flex justify-between items-center">
                <CardTitle>{assessment?.title}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 flex flex-wrap gap-[10px]">
                {candidates.length > 0 ?candidates.map((candidate) => (
                  
                  <div key={candidate.interviewId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors" style={{ margin: "0px" ,  width:
      window.innerWidth >= 1024 && window.innerWidth <= 1704
        ? '100%'
        : window.innerWidth >= 1704
        ? 'auto'
        : undefined, }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-sm">
                            {candidate.firstName[0].toUpperCase() + (candidate.lastName ? candidate.lastName[0].toUpperCase() : '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{candidate.firstName} {candidate.lastName} <span> <Badge className={candidate.status !== 0 ? candidate.status === 2 ? `bg-green-100 text-green-800 mb-2` : `bg-blue-100 text-blue-800 mb-2` : `bg-red-100 text-red-800 mb-2`}>{candidate.status !== 0 ? candidate.status === 2 ? "Selected" : 'Completed' : 'Pending'}</Badge></span></h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{candidate.email}</p>
                          <p className="text-sm text-gray-500">Phone: {candidate.phone}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(candidate)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">Score:</span>
                            <Badge className={getScoreColor(candidate.score)}>
                              {candidate.score}/10
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Interview Time: {Math.round((candidate?.interviewTime || 0) / 60)} min
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-2xl shadow-md border border-gray-100 max-w-[624px]">
                          {/* Assessment Timing Section */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <CalendarDays className="w-5 h-5 text-purple-600" />
                              Assessment Timing
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 mt-[2px] text-gray-500" />
                                <p>
                                  <span className="font-medium text-gray-800">Start:</span>{' '}
                                  {new Date(candidate.startTime).toLocaleString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                    timeZoneName: 'short',
                                  })}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 mt-[2px] text-gray-500" />
                                <p>
                                  <span className="font-medium text-gray-800">End:</span>{' '}
                                  {new Date(candidate.endTime).toLocaleString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                    timeZoneName: 'short',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status Info Section */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <RefreshCcw className="w-5 h-5 text-blue-600" />
                              Status Info
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-start gap-2">
                                <Link2 className="w-4 h-4 mt-[2px] text-gray-500" />
                                <p>
                                  <span className="font-medium text-gray-800">Link Expiry:</span>{' '}
                                  {new Date(candidate.linkExpiryTime).toLocaleString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                    timeZoneName: 'short',
                                  })}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <RefreshCcw className="w-4 h-4 mt-[2px] text-gray-500" />
                                <p>
                                  <span className="font-medium text-gray-800">Last Updated:</span>{' '}
                                  {new Date(candidate.lastStatusUpdatedTime).toLocaleString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                    timeZoneName: 'short',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="flex flex-col items-center space-y-4 my-8">
                      <p className="text-saffron-600 font-medium">No candidates found</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <UserResultsSidebar
            result={result}
            selectedCandidate={selectedCandidate}
            recording={recording}
            transcript={transcript}
            onClose={() => setResult(null)}
          />
        )}
      </div>

      <AddAssessmentModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
      <EditAssessmentModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleUpdateAssessment}
        initialData={selectedAssessmentForEdit}
      />
     
      {/* <CandidateDetailsModal
        open={showDetails}
        onOpenChange={setShowDetails}
        candidate={selectedCandidate}
      /> */}
    </AdminLayout>
  );
};

export default AssessmentsPage;