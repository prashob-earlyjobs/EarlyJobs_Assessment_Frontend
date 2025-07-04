import { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { isUserLoggedIn } from "../services/servicesapis";
import { useUser } from "@/context";

const PageLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-saffron-600 font-medium">Loading...</p>
            </div>
        </div>
    );
};

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { userCredentials, setUserCredentials } = useUser();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const loggedIn = await isUserLoggedIn();
                if (loggedIn.success && loggedIn.user.role !== 'super_admin' && loggedIn.user.role !== 'franchise_admin') {

                    setIsAuthenticated(!!loggedIn); // Convert to boolean
                    setUserCredentials(loggedIn.user);
                }
                else {
                    throw new Error("Admin shouldn't access this page");
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        if (isAuthenticated === null) {
            checkAuth();
        }

        return () => {
            isMounted = false;
        };
    }, [location]); // Only re-run if isAuthenticated is null

    // Handle redirects based on authentication state
    if (isAuthenticated === null) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;