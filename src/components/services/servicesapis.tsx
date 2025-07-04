import Cookies from "js-cookie";
import axiosInstance from "./apiinterseptor"; // Corrected import path
import { toast } from "sonner";

export const userLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        const data = response.data;
        const accessToken = data.data.accessToken; // Corrected destructuring
        if (accessToken) {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`; // Set for all future requests
        }
        return data;
    } catch (error) {
        if (error?.response?.data?.message == 'Account is deactivated') {
            toast.error(`Login failed. This ${error?.response?.data?.message} by admin.`);
            throw new Error('Account is deactivated.');

        }
        else {
            toast.error(`Login failed. ${error?.response?.data?.message}.`);
        }
        throw error;
    }
};

export const isUserLoggedIn = async () => {
    try {
        const response = await axiosInstance.get('/auth/is-logged-in');

        return response.data;

    } catch (error) {
        return error;
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
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
};

export const completeProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/complete-profile', profileData);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}
export const getAssessmentsfromSearch = async ({ category, searchQuery, type, difficulty, page = 1, limit = 10 }) => {
    try {
        const response = await axiosInstance.get(`/assessments?category=${category}&title=${searchQuery}&type=${type}&difficulty=${difficulty}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
};

export const getAssessmentById = async (assessmentId) => {
    try {
        const response = await axiosInstance.get(`/assessments/${assessmentId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/update-profile', profileData);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}
export const userLogout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
        if (!response.data.success) {
            throw new Error("Logout failed");
        }
        Cookies.remove('accessToken');
        axiosInstance.defaults.headers.Authorization = ''; // Clear the Authorization header 
        toast.success("Logged out successfully!");
        return response.data;
    } catch (error) {
        toast.error("Logout failed. Please try again.");
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}


export const adminLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        const data = response.data;
        const accessToken = data.data.accessToken; // Corrected destructuring
        if (accessToken) {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`; // Set for all future requests
        }
        return data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
};

export const getUsers = async ({ searchQuery, role, page = 1, limit = 10 }) => {
    try {
        const response = await axiosInstance.get(`/admin/getUsers?search=${searchQuery}&isActive=undefined&role=${role}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
};

export const getUsersForFranchise = async ({ id, searchQuery, role, page = 1, limit = 10 }) => {
    try {
        const response = await axiosInstance.get(`/admin/getUsersForFranchise/${id}?search=${searchQuery}&isActive=undefined&role=${role}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }

}

export const setUserStatusAactivity = async (userId, isActive) => {
    try {

        const response = await axiosInstance.put(`/admin/users/${userId}/status`, { isActive });
        return response.data;
    }
    catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}


export const getAssessmentsfromAdminSearch = async ({ searchQuery, page = 1, limit = 10 }) => {

    // category, searchQuery, type, difficulty,
    try {
        const response = await axiosInstance.get(`/assessments?title=${searchQuery}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
};

export const getAssessmentByIdForAdmin = async (assessmentId) => {
    try {
        const response = await axiosInstance.get(`/assessments/${assessmentId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const addAssessment = async (assessmentData) => {
    try {
        const response = await axiosInstance.post('/admin/addAssessment', assessmentData);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const editAssessment = async (assessmentData, assessmentId) => {
    try {
        const response = await axiosInstance.put(`/admin/editAssessment/${assessmentId}`, assessmentData);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const getAssessmentsByUserId = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/admin/getAssessments/${userId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const getFranchiser = async (franchiserId: string) => {
    try {
        const response = await axiosInstance.get(`/admin/getFranchiser/${franchiserId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const getOrderIdForPayment = async (paymentdetails) => {
    try {
        const response = await axiosInstance.post(`/getOrderIdForPayment/create-order`, paymentdetails);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }

}

export const addCandidateTransaction = async (userId, assessmentId, paymentdetails) => {
    try {
        const response = await axiosInstance.post(`/transactions/${userId}/${assessmentId}`, paymentdetails);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const getTransactions = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/transactions/${userId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}
export const getTransactionsForAdmin = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get(`/admin/getTransactions`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to fetch transactions';
        toast.error(`${errorMessage}.`);
        return { success: false, message: errorMessage, error };
    }
};