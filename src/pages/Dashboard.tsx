import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { EducatorDashboard } from '@/components/dashboard/EducatorDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { assignRole, createProfile, type AppRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { role, isLoading: isRoleLoading, isEducator, isStudent, isParent, hasRole } = useUserRole();
  const [isAssigningRole, setIsAssigningRole] = React.useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  // Handle role selection for users without a role
  const handleRoleSelect = async (selectedRole: AppRole) => {
    if (!user?.id) return;

    setIsAssigningRole(true);
    try {
      // Create profile first
      await createProfile(user.id, user.name);
      
      // Assign role
      const success = await assignRole(user.id, selectedRole);
      if (!success) {
        throw new Error('Failed to assign role');
      }

      toast.success(`Welcome! You're now set up as a ${selectedRole}.`);
      // Refresh the page to reload user role
      window.location.reload();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to set up your account. Please try again.');
    } finally {
      setIsAssigningRole(false);
    }
  };

  // Show loading state
  if (isAuthLoading || isRoleLoading) {
    return (
      <MainLayout>
        <div className="container py-12 px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show role selection if user doesn't have a role
  if (!hasRole) {
    return (
      <MainLayout>
        <div className="container py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <RoleSelection onSelectRole={handleRoleSelect} isLoading={isAssigningRole} />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render appropriate dashboard based on role
  return (
    <MainLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {isEducator && 'Educator Dashboard'}
            {isStudent && 'Student Dashboard'}
            {isParent && 'Parent Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isEducator && 'Create and manage educational content for your students'}
            {isStudent && 'Explore learning materials and track your progress'}
            {isParent && "Monitor your child's learning journey"}
          </p>
        </div>

        {isEducator && <EducatorDashboard />}
        {isStudent && <StudentDashboard />}
        {isParent && (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Parent Dashboard Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                We're working on features to help you monitor your child's progress.
              </p>
              <Button onClick={() => navigate('/learning')}>
                Explore Learning Activities
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
