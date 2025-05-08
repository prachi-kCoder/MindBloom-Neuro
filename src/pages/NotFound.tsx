
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const isAppointmentBookingPath = location.pathname.includes('/appointments/book/');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-muted/50 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl font-bold">404</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        
        <p className="text-lg text-muted-foreground mb-4">
          We couldn't find the page you were looking for.
        </p>
        
        {isAppointmentBookingPath && (
          <div className="mb-6 p-4 bg-muted/20 rounded-md">
            <p className="text-sm mb-2">
              <strong>Looking for a specialist?</strong> The appointment booking page you tried to access doesn't exist or may have been moved.
            </p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/appointments')}
            >
              Browse All Specialists
            </Button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button variant="outline" className="w-full sm:w-auto" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button className="w-full sm:w-auto" onClick={goHome}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
