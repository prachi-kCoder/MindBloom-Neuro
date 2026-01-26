
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, UserRound, Settings, LogOut, Edit, Mail, Loader2 } from 'lucide-react';

// Mock appointments data (simplified)
const UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    professionalName: 'Dr. Sarah Johnson',
    date: '2025-05-15',
    time: '10:00 AM',
    type: 'Initial Consultation'
  },
  {
    id: '2',
    professionalName: 'Dr. Emily Rodriguez',
    date: '2025-05-22',
    time: '2:30 PM',
    type: 'Dyslexia Assessment'
  }
];

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Populate form with user data when available
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Profile updated",
      description: "Your information has been updated successfully.",
    });
    setIsUpdating(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <MainLayout>
        <div className="container py-12 px-4 md:px-6">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please sign in</h2>
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">
                    <Mail className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                    {user.email}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <Card className="md:col-span-2 border-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle>Welcome back, {user.name.split(' ')[0]}!</CardTitle>
                    <CardDescription>
                      Here's an overview of your MindBloom account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-lg flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Upcoming Appointments</h3>
                            <p className="text-3xl font-bold mt-1">{UPCOMING_APPOINTMENTS.length}</p>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-lg flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <UserRound className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Account Status</h3>
                            <p className="text-sm mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block">
                              Active
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Quick Actions</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => navigate('/appointments')}>
                            Book Appointment
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate('/assessment')}>
                            Take Assessment
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate('/resources')}>
                            View Resources
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Upcoming Appointments Card */}
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Upcoming Appointments</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate('/appointments')}>
                        <span className="sr-only">View all appointments</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {UPCOMING_APPOINTMENTS.length > 0 ? (
                      <div className="space-y-4">
                        {UPCOMING_APPOINTMENTS.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="bg-muted/30 p-3 rounded-md border border-muted"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-primary" />
                              <p className="text-sm font-medium">{appointment.type}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {appointment.professionalName}
                            </p>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate('/appointments')}
                        >
                          View All Appointments
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-2">No upcoming appointments</p>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate('/appointments')}
                        >
                          Schedule Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Resources */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Understanding ADHD</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        A comprehensive guide for parents to understand and support children with ADHD.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate('/resources')}>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Dyslexia Techniques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Effective reading strategies and exercises for children with dyslexia.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate('/resources')}>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Social Skills for ASD</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Activities and tips to help children with autism develop social interaction skills.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate('/resources')}>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Your Appointments</CardTitle>
                  <CardDescription>
                    View and manage your scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                    <div className="mt-4">
                      <TabsContent value="upcoming">
                        {UPCOMING_APPOINTMENTS.length > 0 ? (
                          <div className="divide-y">
                            {UPCOMING_APPOINTMENTS.map((appointment) => (
                              <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <h3 className="font-medium">{appointment.type}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">
                                        {appointment.date} at {appointment.time}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{appointment.professionalName}</p>
                                  </div>
                                  <div className="flex gap-2 mt-2 sm:mt-0">
                                    <Button variant="outline" size="sm">
                                      Details
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                      Reschedule
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">You have no upcoming appointments</p>
                            <Button className="mt-4" onClick={() => navigate('/appointments')}>
                              Schedule Appointment
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="past">
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Your past appointments history will appear here</p>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/appointments')}>
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileForm.name} 
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            {user.avatar && <AvatarImage src={user.avatar} />}
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Button type="button" variant="outline" size="sm">
                            Change Picture
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="Enter to change password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="Leave blank to keep current password" />
                      </div>
                      
                      <div className="pt-4">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Settings className="mr-2 h-4 w-4" />
                              Update Settings
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Notifications</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email notifications</Label>
                        <input 
                          type="checkbox" 
                          id="email-notifications"
                          className="toggle toggle-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Accessibility</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dyslexic-font">Use dyslexic-friendly font</Label>
                        <input 
                          type="checkbox" 
                          id="dyslexic-font"
                          className="toggle toggle-primary"
                        />
                      </div>
                    </div>
                    
                    <Button type="button" variant="outline">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
