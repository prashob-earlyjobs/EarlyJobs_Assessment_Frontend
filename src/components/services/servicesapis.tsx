import Cookies from "js-cookie";
import axiosInstance from "./apiinterseptor"; // Corrected import path
import { toast } from "sonner";

export const userLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        const data = response.data;
        const accessToken = data.data.accessToken; // Corrected destructuring
        console.log("Login successful:", data);
        console.log("Access Token:", accessToken);
        if (accessToken) {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`; // Set for all future requests
        }
        return data;
    } catch (error) {
        console.error("Login failed:", error.response.data.message);
        if (error.response.data.message == 'Account is deactivated') {
            toast.error(`Login failed. This ${error.response.data.message} by admin.`);
            throw new Error('Account is deactivated.');

        }
        else {
            toast.error(`Login failed. ${error.response.data.message}.`);
        }
        throw error;
    }
};

export const isUserLoggedIn = async () => {
    try {
        const response = await axiosInstance.get('/auth/is-logged-in');
        console.log("Check login status response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Check login status failed:", error);
        throw error;
    }
};

export const userSignup = async ({ name, email, mobile, password, referrerId }: { email: string; password: string, name: string, mobile: string, referrerId: string }) => {

    try {
        const response = await axiosInstance.post('/auth/register', { email, password, name, mobile, referrerId });
        const data = response.data;
        const accessToken = data.data.accessToken; // Corrected destructuring

        Cookies.set('accessToken', accessToken, { expires: 7 }); // Store token in cookies for 7 days
        if (accessToken) {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`; // Set for all future requests
        }
        return data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const completeProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/complete-profile', profileData);
        return response.data;
    } catch (error) {
        console.error("Profile completion failed:", error);
        throw error;
    }
}
export const getAssessmentsfromSearch = async ({ category, searchQuery, type, difficulty, page = 1, limit = 10 }) => {
    try {
        const response = await axiosInstance.get(`/assessments?category=${category}&title=${searchQuery}&type=${type}&difficulty=${difficulty}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error;
    }
};

export const getAssessmentById = async (assessmentId) => {
    try {
        const response = await axiosInstance.get(`/assessments/${assessmentId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch assessment by ID:", error);
        throw error;
    }
}

export const updateProfile = async (profileData) => {
    console.log("got profile data in updateProfile:", profileData);
    try {
        const response = await axiosInstance.put('/auth/update-profile', profileData);
        return response.data;
    } catch (error) {
        console.error("Profile update failed:", error);
        throw error;
    }
}
export const userLogout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        console.log("Logout response:", response.data);
        if (!response.data.success) {
            throw new Error("Logout failed");
        }
        Cookies.remove('accessToken');
        axiosInstance.defaults.headers.Authorization = ''; // Clear the Authorization header 
        toast.success("Logged out successfully!");
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
        return error;
    }
}