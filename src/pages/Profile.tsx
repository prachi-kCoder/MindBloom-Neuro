
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Settings, LogOut, Clock, User, Bell, Shield, Bookmark, CalendarClock } from 'lucide-react';

// Mock data for appointments
const UPCOMING_APPOINTMENTS = [
  {
    id: 1,
    professional: "Dr. Sarah Johnson",
    date: "May 10, 2025",
    time: "10:00 AM",
    type: "Virtual",
  },
  {
    id: 2,
    professional: "Dr. David Williams",
    date: "May 15, 2025",
    time: "2:30 PM",
    type: "In-Person",
  }
];

const PAST_APPOINTMENTS = [
  {
    id: 3,
    professional: "Dr. Emily Roberts",
    date: "April 20, 2025",
    time: "11:00 AM",
    type: "Virtual",
  },
  {
    id: 4,
    professional: "Dr. Michael Chen",
    date: "March 25, 2025",
    time: "3:00 PM",
    type: "In-Person",
  }
];

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    navigate('/login');
  };
  
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <Card className="h-fit">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button 
                    variant={activeSection === 'overview' ? "default" : "ghost"} 
                    className={`justify-start rounded-none ${activeSection === 'overview' ? "" : "hover:bg-secondary"}`}
                    onClick={() => setActiveSection('overview')}
                  >
                    <User className="h-4 w-4 mr-2" /> Overview
                  </Button>
                  <Button 
                    variant={activeSection === 'appointments' ? "default" : "ghost"} 
                    className={`justify-start rounded-none ${activeSection === 'appointments' ? "" : "hover:bg-secondary"}`}
                    onClick={() => setActiveSection('appointments')}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Appointments
                  </Button>
                  <Button 
                    variant={activeSection === 'saved' ? "default" : "ghost"} 
                    className={`justify-start rounded-none ${activeSection === 'saved' ? "" : "hover:bg-secondary"}`}
                    onClick={() => setActiveSection('saved')}
                  >
                    <Bookmark className="h-4 w-4 mr-2" /> Saved Resources
                  </Button>
                  <Button 
                    variant={activeSection === 'notifications' ? "default" : "ghost"} 
                    className={`justify-start rounded-none ${activeSection === 'notifications' ? "" : "hover:bg-secondary"}`}
                    onClick={() => setActiveSection('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" /> Notifications
                  </Button>
                  <Button 
                    variant={activeSection === 'privacy' ? "default" : "ghost"} 
                    className={`justify-start rounded-none ${activeSection === 'privacy' ? "" : "hover:bg-secondary"}`}
                    onClick={() => setActiveSection('privacy')}
                  >
                    <Shield className="h-4 w-4 mr-2" /> Privacy & Security
                  </Button>
                </nav>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              {activeSection === 'overview' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Overview</CardTitle>
                      <CardDescription>Your profile information and recent activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">About</h3>
                          <p className="text-sm text-muted-foreground">
                            Welcome to your MindBloom profile, {user?.name}! Here you can manage your appointments, 
                            access saved resources, and track your progress. Complete your profile to get personalized 
                            recommendations and support.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Membership</h3>
                          <div className="flex items-center gap-2">
                            <Badge>Basic Plan</Badge>
                            <span className="text-sm text-muted-foreground">Member since May 2025</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>Your next scheduled sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {UPCOMING_APPOINTMENTS.length > 0 ? (
                        <div className="space-y-4">
                          {UPCOMING_APPOINTMENTS.slice(0, 2).map(appointment => (
                            <div key={appointment.id} className="flex items-start gap-4">
                              <div className="bg-muted rounded-full p-2">
                                <CalendarClock className="h-4 w-4 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium">{appointment.professional}</p>
                                <div className="text-sm text-muted-foreground">
                                  <p>{appointment.date} at {appointment.time}</p>
                                  <p>{appointment.type} appointment</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="ml-auto" 
                                onClick={() => navigate('/appointments')}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                          
                          <Button 
                            variant="link" 
                            className="px-0" 
                            onClick={() => setActiveSection('appointments')}
                          >
                            View all appointments
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-4">You don't have any upcoming appointments.</p>
                          <Button onClick={() => navigate('/appointments')}>
                            Schedule an Appointment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
              
              {activeSection === 'appointments' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Appointments</CardTitle>
                    <CardDescription>View and manage all your appointments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="mb-4">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upcoming">
                        {UPCOMING_APPOINTMENTS.length > 0 ? (
                          <div className="space-y-4">
                            {UPCOMING_APPOINTMENTS.map(appointment => (
                              <div key={appointment.id} className="flex items-center justify-between border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                                <div className="flex items-start gap-4">
                                  <div className="bg-primary/10 rounded-full p-2">
                                    {appointment.type === "Virtual" ? (
                                      <Calendar className="h-4 w-4 text-primary" />
                                    ) : (
                                      <User className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{appointment.professional}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
                                    <Badge variant="outline" className="mt-1">{appointment.type}</Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Reschedule</Button>
                                  <Button size="sm">Join</Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button 
                              variant="outline" 
                              className="w-full mt-4" 
                              onClick={() => navigate('/appointments')}
                            >
                              Schedule New Appointment
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div className="bg-muted inline-flex rounded-full p-3 mb-4">
                              <Calendar className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-4">You don't have any upcoming appointments.</p>
                            <Button onClick={() => navigate('/appointments')}>
                              Find Professionals
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="past">
                        {PAST_APPOINTMENTS.length > 0 ? (
                          <div className="space-y-4">
                            {PAST_APPOINTMENTS.map(appointment => (
                              <div key={appointment.id} className="flex items-center justify-between border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                                <div className="flex items-start gap-4">
                                  <div className="bg-muted rounded-full p-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{appointment.professional}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
                                    <Badge variant="outline" className="mt-1">{appointment.type}</Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Notes</Button>
                                  <Button size="sm">Book Again</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div className="bg-muted inline-flex rounded-full p-3 mb-4">
                              <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">You don't have any past appointments.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
              
              {activeSection === 'saved' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Resources</CardTitle>
                    <CardDescription>Access your bookmarked resources and tools.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex rounded-full p-3 mb-4">
                        <Bookmark className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">You haven't saved any resources yet.</p>
                      <Button onClick={() => navigate('/resources')}>
                        Browse Resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeSection === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex rounded-full p-3 mb-4">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">You don't have any notifications.</p>
                      <p className="text-sm text-muted-foreground">
                        Notification settings will be available soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeSection === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Manage your account security and privacy settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex rounded-full p-3 mb-4">
                        <Shield className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">Privacy and security settings will be available soon.</p>
                      <Button variant="outline" onClick={() => navigate('/settings')}>
                        Go to Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
