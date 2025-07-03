
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';

interface CandidateProfile {
  preferredJobRole?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  skills?: string[];
}

interface Candidate {
  name: string;
  franchise: string;
  email: string;
  createdAt: string | Date;
  lastActivity: string | Date;
  assessmentsCompleted: number;
  averageScore: number;
  profile?: CandidateProfile;
  weaknesses?: string[];
  franchiserId?: string;
}

interface CandidateDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  open,
  onOpenChange,
  candidate,
}) => {
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>
            Comprehensive profile and assessment history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {candidate.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <Badge variant="outline">{candidate?.franchiserId}</Badge>
              </div>
              <div className='space-y-1 text-sm text-gray-600 mb-2'>
                <p>Preferred Job Role: {candidate.profile?.preferredJobRole}</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />

                  {candidate.profile?.address
                    ? `${candidate.profile.address.street || ''}${candidate.profile.address.street ? ', ' : ''}${candidate.profile.address.city || ''}${candidate.profile.address.city ? ', ' : ''}${candidate.profile.address.state || ''}${candidate.profile.address.state ? ', ' : ''}${candidate.profile.address.zipCode || ''}`.replace(/(, )+$/, '') || 'N/A'
                    : 'N/A'}  </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registered: {new Date(candidate?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {candidate?.assessmentsCompleted}
                  </div>
                  <div className="text-sm text-gray-500">Assessments</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getScoreColor(candidate.averageScore).split(' ')[0]}`}>
                    {candidate?.averageScore}%
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {new Date(candidate.lastActivity).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Last Activity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {/* {candidate.profile?.strengths?.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {strength}
                    </Badge>
                  ))} */}
                  {candidate.profile?.skills?.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {/* {candidate?.weaknesses?.map((weakness: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700">
                      {weakness}
                    </Badge>
                  ))} */}
                  {candidate?.profile?.skills?.map((weakness: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assessment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock assessment history */}
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">JavaScript Fundamentals</p>
                    <p className="text-sm text-gray-500">Completed 3 days ago</p>
                  </div>
                  <Badge className={getScoreColor(85)}>85%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">React Development</p>
                    <p className="text-sm text-gray-500">Completed 1 week ago</p>
                  </div>
                  <Badge className={getScoreColor(92)}>92%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Problem Solving</p>
                    <p className="text-sm text-gray-500">Completed 2 weeks ago</p>
                  </div>
                  <Badge className={getScoreColor(78)}>78%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
