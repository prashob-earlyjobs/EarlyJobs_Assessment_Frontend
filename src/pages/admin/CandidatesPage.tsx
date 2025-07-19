import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Eye, Clock, CalendarDays, Link2, RefreshCcw, Loader2 } from 'lucide-react';
import { getPaidAssessments, getAssessmentById, getUsers, getUsersForFranchise, getResultForCandidateAssessment, getRecording, getTranscript } from '@/components/services/servicesapis';
import { useAdmin } from '@/context/AdminContext';
import ResultSidebarForCandidate from '@/components/ResultSidebarForCandidate';
import { toast } from 'sonner';
import UserDetailSidebar from '@/components/UserDetailSidebar';

const LIMIT = 10;

const CandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userAssessments, setUserAssessments] = useState([]);
  const [page, setPage] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false); // For fetchCandidates
  const [loadingCandidates, setLoadingCandidates] = useState({}); // For per-candidate loading
  const [hasMore, setHasMore] = useState(true);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { currentUser } = useAdmin();
  const observer = useRef(null);

  const lastCandidateRef = useCallback(
    (node) => {
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
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: LIMIT,
          searchQuery: searchTerm,
          role: 'candidate',
        };
        const response = currentUser.role === 'super_admin'
          ? await getUsers(params)
          : await getUsersForFranchise({ ...params, franchiseId: currentUser.franchiseId });

        if (!response.success) {
          throw new Error(response.message);
        }

        setCandidates(prev => {
          if (page === 1) return response.data.users;
          return [...prev, ...response.data.users];
        });
        setHasMore(response.data.users.length === LIMIT);
      } catch (error) {
        toast.error("An error occurred while fetching candidates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [page, searchTerm, currentUser]);

  useEffect(() => {
    setPage(1);
    setCandidates([]);
    setHasMore(true);
  }, [searchTerm]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowUserDetails(true);
  };

  const handleViewInterviews = async (id, candidate) => {
    setLoadingCandidates(prev => ({ ...prev, [id]: true }));
    try {
      const response = await getPaidAssessments(id);
      if (!response.success) {
        throw new Error(response.message);
      }

      const assessmentsdata = await Promise.all(
        response.data.map((assessment) =>
          getAssessmentById(assessment.assessmentId)
        )
      );

      const combinedAssessments = await Promise.all(
        response.data.map(async (paidAssessment) => {
          const matchingAssessment = assessmentsdata.find(
            (assessmentData) =>
              assessmentData.data.data.assessment._id === paidAssessment.assessmentId
          );

          let result, recording, transcript;
          try {
            result = await getResultForCandidateAssessment(paidAssessment.interviewId);
            recording = await getRecording(paidAssessment.interviewId);
            transcript = await getTranscript(paidAssessment.interviewId);
          } catch (error) {
            console.error(`Error fetching data for interview ${paidAssessment.interviewId}:`, error);
            result = null;
            recording = null;
            transcript = [];
          }

          if (matchingAssessment) {
            return {
              id: paidAssessment._id, // Added id for dropdown
              assessmentId: paidAssessment.assessmentId,
              assessmentIdVelox: paidAssessment.assessmentIdVelox,
              assessmentLink: paidAssessment.assessmentLink,
              candidateId: paidAssessment.candidateId,
              interviewId: paidAssessment.interviewId,
              linkExpiryTime: paidAssessment.linkExpiryTime,
              createdAt: paidAssessment.createdAt,
              title: matchingAssessment.data.data.assessment.title,
              description: matchingAssessment.data.data.assessment.description,
              category: matchingAssessment.data.data.assessment.category,
              difficulty: matchingAssessment.data.data.assessment.difficulty,
              timeLimit: matchingAssessment.data.data.assessment.timeLimit,
              isPremium: matchingAssessment.data.data.assessment.isPremium,
              pricing: matchingAssessment.data.data.assessment.pricing,
              passingScore: matchingAssessment.data.data.assessment.passingScore,
              tags: matchingAssessment.data.data.assessment.tags,
              result,
              recording: recording?.data || null,
              transcript: transcript?.data || [],
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              email: candidate.email,
              status: paidAssessment.status || 0,
              score: result?.data?.report?.score || 0,
              startTime: paidAssessment.startTime,
              endTime: paidAssessment.endTime,
              lastStatusUpdatedTime: paidAssessment.lastStatusUpdatedTime,
            };
          }

          return {
            id: paidAssessment._id,
            assessmentId: paidAssessment.assessmentId,
            assessmentIdVelox: paidAssessment.assessmentIdVelox,
            assessmentLink: paidAssessment.assessmentLink,
            candidateId: paidAssessment.candidateId,
            interviewId: paidAssessment.interviewId,
            linkExpiryTime: paidAssessment.linkExpiryTime,
            createdAt: paidAssessment.createdAt,
            title: "Unknown Assessment",
            description: "No details available",
            category: null,
            difficulty: null,
            timeLimit: null,
            isPremium: false,
            pricing: null,
            passingScore: null,
            tags: [],
            result: null,
            recording: null,
            transcript: [],
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            status: paidAssessment.status || 0,
            score: 0,
            startTime: paidAssessment.startTime,
            endTime: paidAssessment.endTime,
            lastStatusUpdatedTime: paidAssessment.lastStatusUpdatedTime,
          };
        })
      );

      setUserAssessments(combinedAssessments);
      setSelectedCandidate(candidate);
    } catch (error) {
      toast.error("An error occurred while fetching assessments. Please try again later.");
    } finally {
      setLoadingCandidates(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-2">View and manage candidate profiles and assessment results.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Candidates Overview</CardTitle>
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
              {candidates.length > 0 ? candidates.map((candidate, index) => {
                const isLast = index === candidates.length - 1;
                return (
                  <div
                    key={candidate._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    style={{
                      width:
                        window.innerWidth >= 1024 && window.innerWidth <= 1704
                          ? '100%'
                          : window.innerWidth >= 1704
                          ? 'auto'
                          : undefined,
                    }}
                    ref={isLast ? lastCandidateRef : null}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {candidate.avatar ? (
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          </Avatar>
                        ) : (
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-sm text-gray-700">
                              {candidate.name?.slice(0, 2).toUpperCase() || 'C'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                            {candidate.franchiserId && (
                              <Badge variant="outline">Franchise</Badge>
                            )}
                            <Badge
                              className={
                                candidate.status !== 0
                                  ? candidate.status === 2
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {candidate.status !== 0
                                ? candidate.status === 2
                                  ? 'Selected'
                                  : 'Completed'
                                : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{candidate.email}</p>
                          <p className="text-sm text-gray-500">{candidate.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Average Score:</span>
                          <Badge className={getScoreColor(candidate.averageScore)}>
                            {candidate.averageScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {candidate.assessmentsCompleted} assessments completed
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(candidate)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInterviews(candidate._id, candidate)}
                            disabled={loadingCandidates[candidate._id]}
                          >
                            {loadingCandidates[candidate._id] ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                              </span>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View Assessments
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-2xl shadow-md border border-gray-100 max-w-[624px]">
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
                                {candidate.startTime
                                  ? new Date(candidate.startTime).toLocaleString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Kolkata',
                                      timeZoneName: 'short',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 mt-[2px] text-gray-500" />
                              <p>
                                <span className="font-medium text-gray-800">End:</span>{' '}
                                {candidate.endTime
                                  ? new Date(candidate.endTime).toLocaleString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Kolkata',
                                      timeZoneName: 'short',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
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
                                {candidate.linkExpiryTime
                                  ? new Date(candidate.linkExpiryTime).toLocaleString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Kolkata',
                                      timeZoneName: 'short',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <RefreshCcw className="w-4 h-4 mt-[2px] text-gray-500" />
                              <p>
                                <span className="font-medium text-gray-800">Last Updated:</span>{' '}
                                {candidate.lastStatusUpdatedTime
                                  ? new Date(candidate.lastStatusUpdatedTime).toLocaleString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Kolkata',
                                      timeZoneName: 'short',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex flex-col items-center space-y-4 my-8">
                    <p className="text-saffron-600 font-medium">No candidates found</p>
                  </div>
                </div>
              )}
              {loading && <div className="text-center py-4">Loading...</div>}
              {!hasMore && candidates.length > 0 && (
                <div className="text-center py-4 text-gray-500">No more candidates to load</div>
              )}
              {!loading && candidates.length === 0 && (
                <div className="text-center py-4 text-gray-500">No candidates found</div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedCandidate && showUserDetails && (
          <UserDetailSidebar
            user={selectedCandidate}
            onClose={() => {
              setSelectedCandidate(null);
              setShowUserDetails(false);
            }}
          />
        )}
        {userAssessments.length > 0 && (
          <ResultSidebarForCandidate
            userAssessments={userAssessments}
            selectedCandidate={selectedCandidate}
            onClose={() => setUserAssessments([])}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CandidatesPage;