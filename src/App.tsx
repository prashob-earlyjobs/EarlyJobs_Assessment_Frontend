import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Assessments from "./pages/Assessments";
// import Assessment from "./pages/Assessment";
import AssessmentDetails from "./pages/AssessmentDetails";
import VideoQuestion from "./pages/VideoQuestion";
import Results from "./pages/Results";
import Jobs from "./pages/Jobs";
import BulkApplying from "./pages/BulkApplying";
import BulkApplyingVerify from "./pages/BulkApplyingVerify";
import BulkApplyingPayment from "./pages/BulkApplyingPayment";
import BulkApplyingSuccess from "./pages/BulkApplyingSuccess";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/services/protectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import CandidatesPage from "./pages/admin/CandidatesPage";
import AssessmentsPage from "./pages/admin/AssessmentsPage";
import FranchisesPage from "./pages/admin/FranchisesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProtectedRouteForAdmin from "./components/services/protectedRouteForAdmin";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/index";
import Transactions from "./pages/transactions";
import TransactionsForAdmin from "./pages/admin/transactions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Offers from "./pages/admin/Offers";
import Assessment from "./pages/Assessment";
import FileToShow from "./pages/FileToShow";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AdminProvider>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup/:id" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route
                  path="/assessment/:assessmentname/:id/:referalCode"
                  element={
                      <AssessmentDetails />
                  }
                />
                <Route
                  path="/certificate/:interviewId/:fileName"
                  element={
                    <FileToShow />

                  }
                />
                <Route
                  path="/assessments/:assessmentname/:id"
                  element={<AssessmentDetails />}
                />

                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/assessments" element={<Assessments />} />
                <Route
                  path="/assessmentpayment/:id"
                  element={
                    <ProtectedRoute>
                      <Assessment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/video-question/:id"
                  element={
                    <ProtectedRoute>
                      <VideoQuestion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/"
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-applying"
                  element={
                    <ProtectedRoute>
                      <BulkApplying />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-applying/verify/:count"
                  element={
                    <ProtectedRoute>
                      <BulkApplyingVerify />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-applying/payment/:count"
                  element={
                    <ProtectedRoute>
                      <BulkApplyingPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-applying/success"
                  element={
                    <ProtectedRoute>
                      <BulkApplyingSuccess />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <AdminDashboard />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <UsersPage />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/candidates"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <CandidatesPage />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/assessments"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <AssessmentsPage />
                    </ProtectedRouteForAdmin>
                  }
                />

                <Route
                  path="/admin/franchises"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <FranchisesPage />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <SettingsPage />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <ProtectedRouteForAdmin>
                      {" "}
                      <TransactionsForAdmin />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route
                  path="/admin/offers"
                  element={
                    <ProtectedRouteForAdmin>
                      <Offers />
                    </ProtectedRouteForAdmin>
                  }
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about-us" element={<AboutUs />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
