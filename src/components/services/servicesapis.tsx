import Cookies from "js-cookie";
import axiosInstance from "./apiinterseptor";
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

        return response;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const updateProfile = async (profileData) => {
    try {
      console.log("Updating profile with data:", profileData);
        const response = await axiosInstance.put('/auth/update-profile', profileData);
        console.log("Profile updated successfully:", response.data);
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
        const response = await axiosInstance.get(`assessments/getAssessments/${userId}`);
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
export const getTransactionsForSprAdmin = async (page = 1, limit = 10) => {
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

export const getTransactionsForFranchisenAdmin = async (page = 1, limit = 10) => {
    try {
        const response = await axiosInstance.get(`/admin/franchise/getTransactions/`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to fetch transactions';
        toast.error(`${errorMessage}.`);
        return { success: false, message: errorMessage, error };
    }
};
interface Franchiser {
    name: string;
    email: string;
    password: string;
    street: string;
    city: string;
    state: string;
    country: string;
    mobile: string;
    zipCode: string;
    franchiseId: string

}

export const addFranchiser = async (newFranchise: Franchiser) => {
    try {
        const response = await axiosInstance.post(`/admin/addFranchiser/`, newFranchise);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);

        return error;
    }
}

export const getUserStats = async (userId) => {
    try {
        const response = await axiosInstance.get(`/assessments/getUserStats/${userId}`);
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message}.`);
    }
}

export const getAssessmentsVelox = async () => {
    try {
        const response = await axiosInstance.get(`/admin/getAssessmentsVelox`);
        return response.data;
    }
    catch (error) {
        toast.error(`${error?.response?.data?.message}.`);
    }
}

export const getCandidatesForAssessment = async (assessmentId) => {
    try {
        const response = await axiosInstance.get(`/admin/getCandidatesForAssessment/${assessmentId}`);
        return response.data;
    }
    catch (error) {
        toast.error(`${error?.response?.data?.message}.`);
    }
}
export const getResultForCandidateAssessment = async (interviewId) => {
    try {
        const response = await axiosInstance.get(`/admin/getResultForCandidateAssessment/${interviewId}`);
        return response.data;
    }
    catch (error) {
        toast.error(`${error?.response?.data?.message}.`);
    }

}

export const getAssessmentLink = async (assessmentId, details) => {
    try {
        const response = await axiosInstance.post(`assessments/getAssessmentLink/${assessmentId}`, details);
        return response.data;
    }
    catch (error) {
        toast.error(`${error?.response?.data?.message}.`);
    }
}

export const verifyFranchiseId = async (franchiseId: string) => {
    try {
        const response = await axiosInstance.get(`auth/verifyFranchiseId/${franchiseId}`);
        return response.data;
    }
    catch (error) {
        console.log("error", error);
        toast.error(`${error?.response?.data?.message}.`);
        return error;
    }
}

// Offer APIs
export const getOffers = async () => {
    try {
        const response = await axiosInstance.get('/offers');
        return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
        toast.error(`${error?.response?.data?.message || "Failed to fetch offers"}.`);
        return [];
    }
};

export const addOffer = async (offerData) => {
    try {
        const response = await axiosInstance.post('/offers', offerData);
        toast.success("Offer added successfully!");
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message || "Failed to add offer"}.`);
        throw error;
    }
};

export const editOffer = async (id, offerData) => {
    try {
        const response = await axiosInstance.put(`/offers/${id}`, offerData);
        toast.success("Offer updated successfully!");
        return response.data;
    } catch (error) {
        toast.error(`${error?.response?.data?.message || "Failed to update offer"}.`);
        throw error;
    }
};

export const redeemOffer = async (code: string) => {
    try {
        const response = await axiosInstance.patch(`/offers/${code}/redeem`);
        return response.data;
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || "Failed to redeem offer" };
    }
};

// Upload photo to S3 using email as folder ID
export const uploadPhoto = async (file: File, email: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`/upload/${email}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data?.fileUrl) {
      toast.success("Photo uploaded successfully!");
      return response.data.fileUrl;
    } else {
      console.error('Unexpected response structure:', response.data);
      toast.error("Failed to upload photo - unexpected response format.");
      return null;
    }
  } catch (error: any) {
    console.error('Photo upload error:', error);
    toast.error(error?.response?.data?.message || "Failed to upload photo. Please try again.");
    return null;
  }
};

// Upload resume to S3 using email as folder ID
export const uploadResume = async (file: File, email: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`/upload/${email}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data?.fileUrl) {
      toast.success("Resume uploaded successfully!");
      return response.data.fileUrl;
    } else {
      console.error('Unexpected response structure:', response.data);
      toast.error("Failed to upload resume - unexpected response format.");
      return null;
    }
  } catch (error: any) {
    console.error('Resume upload error:', error);
    toast.error(error?.response?.data?.message || "Failed to upload resume. Please try again.");
    return null;
  }
};
