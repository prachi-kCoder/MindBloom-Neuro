import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Mic, 
  TrendingUp, 
  LayoutDashboard,
  Gamepad2,
  Settings
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

const learnerMenuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Lessons',
    url: '/dashboard/lessons',
    icon: BookOpen,
  },
  {
    title: 'Voice-to-Text Lab',
    url: '/dashboard/voice-lab',
    icon: Mic,
  },
  {
    title: 'Learning Games',
    url: '/dashboard/games',
    icon: Gamepad2,
  },
  {
    title: 'Personal Pace Tracker',
    url: '/dashboard/progress',
    icon: TrendingUp,
  },
];

export function LearnerSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Learning Hub</h2>
            <p className="text-xs text-muted-foreground">Explore & Learn</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learnerMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
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
