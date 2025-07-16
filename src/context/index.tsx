import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
        resumeUrl?: string | null;
        gender: string;
        dateOfBirth: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
        };
        preferredJobRole: string;
        skills: string[];
        experience: string[];
        education: string[];
        bio: string;
        prefJobLocations: string[];
    };
    updatedAt: string;
    franchiserId: string | null;
    referrerId: string | null;
    _id: string;
}

interface UserContextType {
    userCredentials: UserCredentials | null;
    setUserCredentials: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
}

const UserContext = createContext<UserContextType>({
    userCredentials: null,
    setUserCredentials: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);




    return (
        <UserContext.Provider value={{ userCredentials, setUserCredentials }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
