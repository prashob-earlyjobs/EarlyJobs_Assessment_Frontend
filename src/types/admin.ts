
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'candidate' | 'franchise' | 'admin';
  registrationDate: string;
  isActive: boolean;
  franchiseId?: string;
  createdAt?: string;
  location?: string;
  referrerId?: string;
}

export interface Assessment {
  id: string;
  assessmentId?: string;
  _id?: string; // Optional for compatibility with existing data
  title: string;
  description: string;
  skillTags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  questions?: string[]; // Assuming questions are objects, adjust type as needed
  attempts: number;
  averageScore: number;
  completionRate: number;
  createdDate: string;
  type: 'mcq' | 'coding' | 'video' | 'mixed';
  category: 'technical' | 'aptitude' | 'personality' | 'communication';
  timeLimit: number; // in minutes
  passingScore: number; // in percentage
  tags: string[];
  shortId: string;
  pricing: {
    basePrice: number;
    discountedPrice: number;
  };
  offer: {
    title: string;
    type: string;
    value: number;
    validUntil: string;
  };
  isPremium: boolean;
}

export interface AssessmentResult {
  id: string;
  candidateId: string;
  assessmentId: string;
  score: number;
  timeTaken: number; // in minutes
  completedDate: string;
  strengths: string[];
  weaknesses: string[];
  aiFeedback: string;
}

export interface Franchise {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  activeUsers: number;
  totalAssessments: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAssessments: number;
  assessmentsTaken: number;
  franchiseCount: number;
  averageScore: number;
}

export type UserRole = 'super_admin' | 'franchise_admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  franchiseId?: string;
}
