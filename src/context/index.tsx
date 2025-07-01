import React, { createContext, useContext, useState } from 'react';

export interface UserCredentials {
    role: 'candidate' | 'recruiter' | 'franchise' | 'super_admin' | 'franchise_admin';
    authProvider: string;
    avatar: string;
    createdAt: string;
    email: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    lastLogin: string;
    mobile: string;
    name: string;
    profile: {
        skills: string[];
        experience: string[];
        education: string[];
        bio: string;
        prefJobLocations: string[];
    };
    updatedAt: string;
    _id: string;
    // Add more fields as needed
}

interface UserContextType {
    userCredentials: UserCredentials | null;
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
}

const UserContext = createContext<UserContextType>({
    userCredentials: null,
    setUserCredentials: () => { },
});

export const UserProvider = ({ children }) => {
    const [userCredentials, setUserCredentials] = useState(null);

    return (
        <UserContext.Provider value={{ userCredentials, setUserCredentials }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);