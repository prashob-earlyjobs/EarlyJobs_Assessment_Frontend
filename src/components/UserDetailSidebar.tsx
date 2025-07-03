
// import React, { useEffect } from 'react';
// import { X, Mail, Phone, MapPin, Calendar, Shield, ShieldOff, Key, UserCog, MessageSquare } from 'lucide-react';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Separator } from './ui/separator';
// import { UserCredentials } from '../context/index';
// import { motion, AnimatePresence } from "framer-motion";
// import { getAssessmentsByUserId } from './services/servicesapis';

// interface UserDetailSidebarProps {
//   user: UserCredentials | null;
//   onClose: () => void;
// }

// const sidebarVariants = {
//   hidden: { x: '100%', opacity: 0 },
//   visible: { x: 0, opacity: 1 },
//   exit: { x: '100%', opacity: 0 }
// };

// const UserDetailSidebar: React.FC<UserDetailSidebarProps> = ({ user, onClose }) => {
//   useEffect(() => {
//     const getAssessmentsAndRes = async () => {
//       try {
//         const response = await getAssessmentsByUserId(user._id);
//         if (!response.success) throw new Error(response.message);
//         console.log('Assessments and results:', response);
//         // Fetch assessments and results here
//       } catch (error) {
//         console.error('Error fetching assessments and results:', error);
//       }
//     };

//     getAssessmentsAndRes();
//   }, []);

//   if (!user) return null;

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case 'HR':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'SHM':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'BDE':
//         return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusBadgeColor = (status: boolean) => {
//     return status
//       ? 'bg-green-100 text-green-800 border-green-200'
//       : 'bg-red-100 text-red-800 border-red-200';
//   };

//   return (
//     <AnimatePresence mode='wait'>
//       <>
//         <motion.div
//           key="backdrop"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.5 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="fixed inset-0 bg-black z-40"
//           onClick={onClose}
//           style={{ marginTop: "0px" }}

//         />
//         <motion.div
//           key={user._id}
//           variants={sidebarVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//           className="fixed top-0 right-0 h-full w-[50%] bg-white border-l border-border z-50 shadow-xl"
//           style={{ marginTop: "0px" }}
//         >
//           <div className="flex flex-col h-full">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-border">
//               <h2 className="text-lg font-semibold text-foreground">Candidate Details</h2>
//               <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>

//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {/* User Profile */}
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-16 h-16">
//                   <AvatarFallback className="text-lg">
//                     {user.name.slice(0, 2).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Badge className={getRoleBadgeColor(user.role)}>
//                       {user.role}
//                     </Badge>
//                     <Badge className={getStatusBadgeColor(user.isActive)}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-foreground mb-3">Contact Information</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <Mail className="w-4 h-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm text-foreground">{user.email}</p>
//                       <p className="text-xs text-muted-foreground">Email Address</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Phone className="w-4 h-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm text-foreground">{user.mobile}</p>
//                       <p className="text-xs text-muted-foreground">Phone Number</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <MapPin className="w-4 h-4 text-muted-foreground" />
//                   </div>
//                 </div>
//               </div>


//               {/* Contact Information */}

//               <Separator />

//               {/* Professional Information */}
//               <div>
//                 <h4 className="text-sm font-medium text-foreground mb-3">Professional Information</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <Calendar className="w-4 h-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
//                       <p className="text-xs text-muted-foreground">Join Date</p>
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               <Separator />
//               <div>
//                 <h4 className="text-sm font-medium text-foreground mb-3">Assessments Taken</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <Calendar className="w-4 h-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
//                       <p className="text-xs text-muted-foreground">Join Date</p>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//               <Separator />

//               {/* Activity Stats */}
//               <div>
//                 <h4 className="text-sm font-medium text-foreground mb-3">Activity Overview</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-muted/50 rounded-lg p-3">
//                     <p className="text-lg font-semibold text-foreground">0</p>
//                     <p className="text-xs text-muted-foreground">Total Candidates</p>
//                   </div>
//                   <div className="bg-muted/50 rounded-lg p-3">
//                     <p className="text-lg font-semibold text-foreground">0</p>
//                     <p className="text-xs text-muted-foreground">Active Jobs</p>
//                   </div>
//                   <div className="bg-muted/50 rounded-lg p-3">
//                     <p className="text-lg font-semibold text-foreground">2h ago</p>
//                     <p className="text-xs text-muted-foreground">Last Active</p>
//                   </div>
//                   <div className="bg-muted/50 rounded-lg p-3">
//                     <p className="text-lg font-semibold text-foreground">15</p>
//                     <p className="text-xs text-muted-foreground">Total Logins</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}

//           </div>
//         </motion.div>
//       </>
//     </AnimatePresence>
//   );
// };

// export default UserDetailSidebar;
// legend: { position: "right" as const, labels: { boxWidth: 10, font: { size: 12 } } },


import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, User, Briefcase, Book, Globe, Wrench, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { UserCredentials } from '../context/index';
import { motion, AnimatePresence } from "framer-motion";
import { getAssessmentsByUserId, getFranchiser } from './services/servicesapis';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserDetailSidebarProps {
  user: UserCredentials | null;
  onClose: () => void;
}

const sidebarVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 }
};

const UserDetailSidebar: React.FC<UserDetailSidebarProps> = ({ user, onClose }) => {
  const [assessments, setAssessments] = useState([]);
  const [franchiser, setFranchiser] = useState(null);

  useEffect(() => {
    console.log('User:', user);
    const getAssessmentsAndRes = async () => {
      try {
        const response = await getAssessmentsByUserId(user._id);
        if (!response.success) throw new Error(response.message);
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments and results:', error);
      }
      if (user.franchiserId) {
        try {
          const response = await getFranchiser(user.franchiserId);
          if (!response.success) throw new Error(response.message);
          console.log('Franchiser:', response.data);
          setFranchiser(response.data.franchiser);
        } catch (error) {
          console.error('Error fetching assessments and results:', error);
        }

      }
    };

    if (user) getAssessmentsAndRes();

  }, [user]);

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'HR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'BDE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: boolean) => {
    return status
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getPieData = (categoryWiseScore) => {
    if (!categoryWiseScore || categoryWiseScore.length === 0) return { labels: [], datasets: [] };
    const labels = categoryWiseScore.map(item => item.category);
    const data = categoryWiseScore.map(item => item.score);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB'],
          borderColor: ['#fff', '#fff', '#fff'],
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 6, font: { size: 12 } } },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <AnimatePresence mode='wait'>
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
          style={{ marginTop: '0px' }}
        />
        <motion.div
          key={user._id}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-[50%] bg-white border-l border-gray-200 z-50 shadow-lg overflow-y-auto"
          style={{ marginTop: '0px' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Candidate Details</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
                <X className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-gray-200">
                  <AvatarFallback className="text-lg text-gray-700">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusBadgeColor(user.isActive)}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />
              {franchiser && (
                <details className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <summary className="font-medium text-gray-900 cursor-pointer">
                    Franchise Details
                  </summary>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-900">{franchiser.name}</p>
                        <p className="text-xs text-gray-500">Franchise Name</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-900">{franchiser.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-900">{franchiser.mobile}</p>
                        <p className="text-xs text-gray-500">Mobile</p>
                      </div>
                    </div>
                  </div>
                </details>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-900">{user.mobile}</p>
                      <p className="text-xs text-gray-500">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-900">{user.profile?.address?.street}, {user.profile?.address?.city}, {user.profile?.address?.zipCode}, {user.profile?.address?.state}, {user.profile?.address?.country}</p>
                      <p className="text-xs text-gray-500">Address</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Professional Information</h4>
                <div className="space-y-4">
                  <div className='flex justify-between max-w-[580px]'>
                    <div className="flex flex-col items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">Join Date</p>
                        </div>
                      </div>


                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-900">{new Date(user.profile?.dateOfBirth).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">Date of Birth</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-3">

                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 inline-block ml-2">Skills</h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {user.profile?.skills?.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>


                      <div className="flex items-center gap-3">

                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 inline-block">Experience</h5>
                          <p className="text-sm text-gray-600">
                            {user.profile?.experience.length > 0 ? user.profile.experience.join(', ') : 'No experience listed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Book className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Bio</h5>
                      <p className="text-sm text-gray-600">{user.profile?.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Preferred Job Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Preferred Job Details</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Preferred Locations</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.profile?.prefJobLocations?.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Gender</h5>
                      <p className="text-sm text-gray-600">{user.profile?.gender || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Preferred Job Role</h5>
                      <p className="text-sm text-gray-600">{user.profile?.preferredJobRole || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Assessments Taken */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Assessments Taken</h4>
                <div className="space-y-4">
                  {assessments.map((item) => (
                    <details key={item.assessment._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm md:relative">
                      <summary className="font-medium text-gray-900 cursor-pointer">
                        {item.assessment.title} ({item.assessment.category})
                      </summary>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">Score: {item.result.totalPoints}/{item.result.maxPoints}</p>
                          <p className="text-sm text-gray-700"> <span className="font-medium text-gray-900"> Status: </span>{item.result.status}</p>
                          <p className="text-sm text-gray-700"><span className="font-medium text-gray-900">Time Taken: </span>{item.result.timeTaken} Minutes</p>
                          <p className="text-sm text-gray-700"><span className="font-medium text-gray-900">Feedback: </span>{item.result.feedback.systemFeedback}</p>
                        </div>
                        <div className="h-48">
                          <Pie
                            className="static sm:static md:static xxl:absolute top-[17px] h-[150px] w-[150px]"
                            data={getPieData(item.result.resultDetails.categoryWiseScore)}
                            options={pieOptions}
                          />
                        </div>
                      </div>
                    </details>
                  ))}
                  {assessments.length === 0 && <p className="text-gray-600">No assessments taken yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default UserDetailSidebar;