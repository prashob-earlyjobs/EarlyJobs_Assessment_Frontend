
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    ArrowLeft,
    Bell,
    LogIn,
    LogOut,
    User,
} from "lucide-react";
import { toast } from "sonner";
import { isUserLoggedIn, userLogout } from "@/components/services/servicesapis";
import { useUser } from "@/context";

const notifications = [
    {
        id: 1, title: "You're All Set to Begin! 🚀",
        message: "Welcome to EarlyJobs Assessments. A new challenge awaits—give it your best shot!", unread: true
    },
];

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        avatar: "",
        profile: {

            preferredJobRole: "",
        },
        mobile: ""
    });

    const [showNotifications, setShowNotifications] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const { userCredentials, setUserCredentials } = useUser();



    const handleProfileClick = () => {
        navigate('/profile');
    };
   
    // useEffect(() => {
    //     // Simulate fetching user data
    //     const fetchUserData = async () => {
    //         try {

    //             const response = await isUserLoggedIn();
    //             if (!response.success) {
    //                 toast.error("You need to log in first!");
    //                 navigate('/login');
    //                 return;
    //             }
    //             // setUserCredentials({
    //             //     authProvider: response.user.authProvider,
    //             //     avatar: response.user.avatar,
    //             //     createdAt: response.user.createdAt,
    //             //     email: response.user.email,
    //             //     isActive: response.user.isActive,
    //             //     isEmailVerified: response.user.isEmailVerified,
    //             //     isPhoneVerified: response.user.isPhoneVerified,
    //             //     lastLogin: response.user.lastLogin,
    //             //     mobile: response.user.mobile,
    //             //     role: response.user.role,
    //             //     name: response.user.name,
    //             //     profile: {
    //             //         gender: response.user.profile.gender || '',
    //             //         dateOfBirth: response.user.profile.dateOfBirth || '',
    //             //         address: {
    //             //             street: response.user.profile.address?.street || '',
    //             //             city: response.user.profile.address?.city || '',
    //             //             state: response.user.profile.address?.state || '',
    //             //             country: response.user.profile.address?.country || '',
    //             //             zipCode: response.user.profile.address?.zipCode || '',
    //             //         },
    //             //         preferredJobRole: response.user.profile.preferredJobRole || '',
    //             //         skills: response.user.profile.skills || [],
    //             //         experience: response.user.profile.experience || [],
    //             //         education: response.user.profile.education || [],
    //             //         bio: response.user.profile.bio || '',
    //             //         prefJobLocations: response.user.profile.prefJobLocations || [],
    //             //     },
    //             //     updatedAt: response.user.updatedAt,
    //             //     _id: response.user._id,
    //             // });
    //             setUserDetails(response.user);
    //         } catch (error) {
    //             toast.error("Failed to fetch user data. Please try again later.");

    //         }


    //     };
    //     fetchUserData();
    // }, []);
    const handleLogout = async () => {
        try {
            const response = await userLogout();
            if (!response.success) {
                throw new Error("Logout failed");
            }
            toast.success("Logged out successfully!");
            setUserCredentials(null); // Clear user credentials
            navigate('/login');
        }


        catch (error) {

            toast.error("Logout failed. Please try again.");
        }
        // toast.success("Logged out successfully!");
        // navigate('/');
    };
    useEffect(() => {
        if (showNotifications === true) {
            notifications.forEach((notification) => {
                if (notification.unread) {
                    notification.unread = false;
                }
            })

        }
    }, [showNotifications]);
  

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {
                            location.pathname !== '/dashboard' &&
                            <Button variant="ghost" onClick={() => window.history.back()} className="rounded-2xl">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        }

                        <img
                            src="/images/logo.png"
                            onClick={() => navigate('/dashboard')}
                            alt="EarlyJobs Logo"
                            className="h-[3.5rem] w-auto cursor-pointer"
                        />
                    </div>
{   userCredentials!==null  ?

                    <div className="flex items-center space-x-4">
                        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative rounded-2xl p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                >
                                    <Bell className="h-5 w-5" />
                                    {notifications.some(n => n.unread) && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 rounded-2xl">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${notification.unread ? 'bg-orange-50/50' : ''}`}>
                                            <div className="flex items-start space-x-3">
                                                <div className={`p-2 rounded-full ${notification.unread ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                                    <Bell className={`h-4 w-4 ${notification.unread ? 'text-orange-600' : 'text-gray-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                                </div>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLogoutDialog(true)}
                            className="rounded-2xl p-3 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
                            <Avatar className="h-10 w-10">
                                
                                <AvatarImage src={userCredentials.avatar} />
                                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                                    {userCredentials?.name?.split(' ').map(n => n[0]).join('')?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">{userCredentials.name}</p>
                                <p className="text-xs text-gray-500">{userCredentials.profile?.preferredJobRole}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/login')}
                            className="rounded-2xl p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                            <LogIn className="h-5 w-5" />
                            Login
                        </Button>
                    </div>
}
                </div>
            </div>
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout? You will need to sign in again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="rounded-2xl bg-red-600 hover:bg-red-700">
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    )
};
export default Header