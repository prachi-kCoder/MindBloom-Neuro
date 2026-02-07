import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { DashboardLayout } from '@/components/roles/DashboardLayout';
import { TeacherDashboard } from '@/components/roles/teacher/TeacherDashboard';
import { LearnerDashboard } from '@/components/roles/learner/LearnerDashboard';
import { LearnerLessons } from '@/components/roles/learner/LearnerLessons';
import { LearnerVoiceLab } from '@/components/roles/learner/LearnerVoiceLab';
import { LearnerGames } from '@/components/roles/learner/LearnerGames';
import { LearnerProgressTracker } from '@/components/roles/learner/LearnerProgressTracker';
import { ParentDashboard } from '@/components/roles/parent/ParentDashboard';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { assignRole, createProfile, type AppRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isRoleLoading, isEducator, isStudent, isParent, hasRole } = useUserRole();
  const [isAssigningRole, setIsAssigningRole] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  const handleRoleSelect = async (selectedRole: AppRole) => {
    if (!user?.id) return;
    setIsAssigningRole(true);
    try {
      await createProfile(user.id, user.name);
      const success = await assignRole(user.id, selectedRole);
      if (!success) throw new Error('Failed to assign role');
      toast.success(`Welcome! You're now set up as a ${selectedRole}.`);
      window.location.reload();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to set up your account. Please try again.');
    } finally {
      setIsAssigningRole(false);
    }
  };

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

  // Learner gets sub-routes
  if (isStudent) {
    return (
      <DashboardLayout>
        <Routes>
          <Route index element={<LearnerDashboard />} />
          <Route path="lessons" element={<LearnerLessons />} />
          <Route path="voice-lab" element={<LearnerVoiceLab />} />
          <Route path="games" element={<LearnerGames />} />
          <Route path="progress" element={<LearnerProgressTracker />} />
        </Routes>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isEducator && 'Educator Dashboard'}
            {isParent && 'Parent Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isEducator && 'Create and manage educational content for your students'}
            {isParent && "Monitor your child's learning journey"}
          </p>
        </div>
        {isEducator && <TeacherDashboard />}
        {isParent && <ParentDashboard />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
