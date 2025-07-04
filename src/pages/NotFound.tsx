import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {


    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 w-12 h-12" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
        <p className="text-lg text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to home in <span className="font-semibold">{countdown}</span> second{countdown !== 1 ? "s" : ""}...
        </p>
        <Button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
