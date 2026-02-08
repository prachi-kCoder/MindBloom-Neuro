import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  LayoutDashboard,
  BookOpen,
  Settings,
  Brain,
  Library,
  GraduationCap,
  Accessibility,
  Upload,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const teacherMenuItems = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Classroom', url: '/dashboard/classroom', icon: Users },
  { title: 'Content Manager', url: '/dashboard/content', icon: Upload },
  { title: 'AI Lesson Planner', url: '/dashboard/lesson-planner', icon: Brain },
  { title: 'Resource Library', url: '/dashboard/resources', icon: Library },
  { title: 'Analytics', url: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Professional Dev', url: '/dashboard/development', icon: GraduationCap },
  { title: 'Accessibility', url: '/dashboard/accessibility', icon: Accessibility },
];

export function TeacherSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Educator Portal</h2>
            <p className="text-xs text-muted-foreground">Manage & Teach</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teacherMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <NavLink 
          to="/profile" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}
