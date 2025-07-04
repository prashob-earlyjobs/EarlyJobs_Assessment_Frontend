import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CandidateDetailsModal } from '@/components/admin/CandidateDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { getUsers, getUsersForFranchise } from '@/components/services/servicesapis';
import { useAdmin } from '@/context/AdminContext';
import UserDetailSidebar from '@/components/UserDetailSidebar';
import { toast } from 'sonner';

const CandidatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { currentUser } = useAdmin();

  // Mock candidate data
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    // Reset search and filter when users change
    const resetSearchAndFilter = async () => {
      try {
        const response = currentUser.role === 'super_admin' ? await getUsers({ searchQuery: searchTerm, role: 'candidate' }) : await getUsersForFranchise({ id: currentUser.id, searchQuery: searchTerm, role: 'candidate' });

        if (!response.success) {
          throw new Error(response.message);
        }
        setCandidates(response.data.users);
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
        return;
      }
    }

    resetSearchAndFilter();
  }, [searchTerm]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
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

        <Card >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Candidate Overview</CardTitle>
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
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          {
                            candidate?.franchiserId && (
                              <Badge variant="outline">
                                Franchise
                              </Badge>
                            )
                          }
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Average Score:</span>
                          <Badge className={getScoreColor(candidate.averageScore)}>
                            {candidate.averageScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {candidate?.assessmentsCompleted} assessments completed
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(candidate)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Strengths
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.profile?.skills?.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Areas for Improvement
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.profile?.skills?.map((weakness, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCandidate && (
          <UserDetailSidebar
            user={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </div>

      <CandidateDetailsModal
        open={showDetails}
        onOpenChange={setShowDetails}
        candidate={selectedCandidate}
      />
    </AdminLayout>
  );
};

export default CandidatesPage;