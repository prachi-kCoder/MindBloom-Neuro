import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TeacherSidebar } from './teacher/TeacherSidebar';
import { LearnerSidebar } from './learner/LearnerSidebar';
import { ParentSidebar } from './parent/ParentSidebar';
import { useUserRole } from '@/hooks/useUserRole';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isEducator, isStudent, isParent } = useUserRole();

  const renderSidebar = () => {
    if (isEducator) return <TeacherSidebar />;
    if (isStudent) return <LearnerSidebar />;
    if (isParent) return <ParentSidebar />;
    return null;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {renderSidebar()}
        
        <div className="flex-1 flex flex-col">
          {/* Mobile header with sidebar trigger */}
          <header className="h-14 border-b flex items-center px-4 lg:hidden">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <span className="ml-3 font-semibold">
              {isEducator && 'Educator Portal'}
              {isStudent && 'Learning Hub'}
              {isParent && 'Parent Portal'}
            </span>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
