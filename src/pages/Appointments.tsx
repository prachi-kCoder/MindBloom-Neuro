
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessionalDirectory from '@/components/appointments/ProfessionalDirectory';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock appointments data
const UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    professionalId: '1',
    professionalName: 'Dr. Sarah Johnson',
    professionalTitle: 'Child Psychologist',
    date: '2025-05-15',
    time: '10:00 AM',
    type: 'Initial Consultation',
    location: 'Video Call',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4'
  },
  {
    id: '2',
    professionalId: '3',
    professionalName: 'Dr. Emily Rodriguez',
    professionalTitle: 'Educational Psychologist',
    date: '2025-05-22',
    time: '2:30 PM',
    type: 'Dyslexia Assessment',
    location: 'In-person',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf'
  }
];

const PAST_APPOINTMENTS = [
  {
    id: '3',
    professionalId: '2',
    professionalName: 'Dr. Michael Chen',
    professionalTitle: 'Developmental Pediatrician',
    date: '2025-04-10',
    time: '1:00 PM',
    type: 'Follow-up',
    location: 'Video Call',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d1d4f9'
  },
  {
    id: '4',
    professionalId: '1',
    professionalName: 'Dr. Sarah Johnson',
    professionalTitle: 'Child Psychologist',
    date: '2025-03-25',
    time: '11:30 AM',
    type: 'Initial Consultation',
    location: 'In-person',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4'
  }
];

interface AppointmentCardProps {
  appointment: typeof UPCOMING_APPOINTMENTS[0];
  isPast?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, isPast = false }) => {
  const navigate = useNavigate();
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleViewDetails = () => {
    navigate(`/appointments/details/${appointment.id}`);
  };
  
  const handleReschedule = () => {
    navigate(`/appointments/reschedule/${appointment.id}`);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/30 p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{appointment.type}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(appointment.date)} at {appointment.time}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={appointment.photo}
            alt={appointment.professionalName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium">{appointment.professionalName}</h4>
            <p className="text-sm text-muted-foreground">{appointment.professionalTitle}</p>
          </div>
        </div>
        
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>{appointment.location}</span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
          {!isPast && (
            <Button size="sm" onClick={handleReschedule}>
              Reschedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("find");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Appointments</h1>
            {!isAuthenticated && (
              <Button onClick={() => navigate('/login')}>
                <UserRound className="mr-2 h-4 w-4" />
                Sign In to Book
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="find">Find Specialists</TabsTrigger>
              <TabsTrigger value="upcoming" disabled={!isAuthenticated}>Upcoming</TabsTrigger>
              <TabsTrigger value="past" disabled={!isAuthenticated}>Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="find">
              <div className="bg-muted/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">Connect with Specialists</h2>
                <p className="text-muted-foreground">
                  Browse our network of experienced professionals specialized in neurodevelopmental care.
                  Each specialist has been carefully vetted to ensure the highest quality of care for your child.
                </p>
                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Note:</span> You can browse our specialists without signing in, 
                      but you'll need to create an account or sign in to book appointments.
                    </p>
                  </div>
                )}
              </div>
              
              <ProfessionalDirectory />
            </TabsContent>
            
            <TabsContent value="upcoming">
              {isAuthenticated ? (
                UPCOMING_APPOINTMENTS.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {UPCOMING_APPOINTMENTS.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium">No upcoming appointments</h3>
                    <p className="text-muted-foreground mt-2">Schedule an appointment with one of our specialists</p>
                    <Button className="mt-4" onClick={() => setActiveTab("find")}>
                      Find Specialists
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">Please sign in</h3>
                  <p className="text-muted-foreground mt-2">Sign in to view and manage your appointments</p>
                  <Button className="mt-4" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {isAuthenticated ? (
                PAST_APPOINTMENTS.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PAST_APPOINTMENTS.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        isPast 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium">No past appointments</h3>
                    <p className="text-muted-foreground mt-2">Your appointment history will appear here</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">Please sign in</h3>
                  <p className="text-muted-foreground mt-2">Sign in to view your appointment history</p>
                  <Button className="mt-4" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
