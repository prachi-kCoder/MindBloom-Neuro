
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Define the Professional interface to match the data structure we're using
interface Professional {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  education: string;
  photo: string;
  availability: string;
  location: string;
  bio: string;
}

// Extended Professional interface to include availableTimeSlots
interface ExtendedProfessional extends Professional {
  availableTimeSlots?: {
    [key: string]: string[];
  };
}

// Mock data for professionals - accessing by ID
const PROFESSIONALS: ExtendedProfessional[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Child Psychologist",
    specialties: ["ADHD", "Anxiety", "Behavioral Issues"],
    experience: "15+ years",
    education: "Ph.D. in Clinical Psychology",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    availability: "Mon, Wed, Fri",
    location: "123 Health Center, San Francisco, CA",
    bio: "Dr. Johnson specializes in diagnosing and treating ADHD and anxiety disorders in children. She employs a holistic approach, working with parents to develop effective strategies for home and school.",
    availableTimeSlots: {
      "2025-05-15": ["09:00", "10:30", "13:00", "15:30"],
      "2025-05-16": ["10:00", "11:30", "14:00"],
      "2025-05-17": ["09:30", "11:00", "14:30"],
      "2025-05-18": ["10:00", "13:00", "15:00"],
    }
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Developmental Pediatrician",
    specialties: ["ASD", "Developmental Delays", "Sensory Processing"],
    experience: "12+ years",
    education: "M.D., Fellowship in Developmental Pediatrics",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    availability: "Tue, Thu, Sat",
    location: "456 Medical Plaza, San Francisco, CA",
    bio: "Dr. Chen has extensive experience working with children with autism spectrum disorders. He focuses on early intervention and collaborates with therapists to create comprehensive treatment plans.",
    availableTimeSlots: {
      "2025-05-14": ["09:00", "11:30", "14:00"],
      "2025-05-16": ["10:00", "13:30", "15:00"],
      "2025-05-18": ["09:30", "11:00", "14:30"],
    }
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Educational Psychologist",
    specialties: ["Dyslexia", "Learning Disabilities", "Gifted Assessment"],
    experience: "10+ years",
    education: "Ed.D. in Educational Psychology",
    photo: "https://images.unsplash.com/photo-1594824388853-5d78f8b1cb9a?w=400&h=400&fit=crop&crop=face",
    availability: "Mon, Tue, Thu",
    location: "789 Learning Center, Oakland, CA",
    bio: "Dr. Rodriguez specializes in identifying and addressing learning disabilities. She works closely with schools to implement accommodations and develop individualized education plans.",
    availableTimeSlots: {
      "2025-05-13": ["10:00", "11:30", "14:00"],
      "2025-05-15": ["09:30", "13:00", "15:30"],
      "2025-05-17": ["10:00", "11:30", "13:00"],
    }
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Child Psychiatrist",
    specialties: ["ADHD", "Mood Disorders", "Medication Management"],
    experience: "18+ years",
    education: "M.D., Board Certified in Child Psychiatry",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    availability: "Wed, Fri, Sat",
    location: "567 Wellness Center, Palo Alto, CA",
    bio: "Dr. Wilson provides comprehensive psychiatric evaluations and medication management. He believes in a thoughtful approach to medication, carefully weighing benefits against potential side effects.",
    availableTimeSlots: {
      "2025-05-14": ["09:30", "11:00", "14:30"],
      "2025-05-16": ["10:00", "13:30", "16:00"],
      "2025-05-18": ["09:00", "11:30", "14:00"],
    }
  }
];

// Appointment types
const APPOINTMENT_TYPES = [
  {
    id: "initial",
    name: "Initial Consultation",
    duration: "60 min",
    price: "$250",
    description: "A comprehensive first visit to understand your child's needs and develop an initial assessment plan."
  },
  {
    id: "followup",
    name: "Follow-up Session",
    duration: "45 min",
    price: "$180",
    description: "Regular check-in to monitor progress, adjust strategies, and address ongoing concerns."
  },
  {
    id: "assessment",
    name: "Full Assessment",
    duration: "90 min",
    price: "$350",
    description: "In-depth evaluation including standardized testing and comprehensive report."
  }
];

const AppointmentBooking = () => {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [professional, setProfessional] = useState<ExtendedProfessional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("initial");
  const [step, setStep] = useState<number>(1);

  // Find professional data based on ID
  useEffect(() => {
    const found = PROFESSIONALS.find(p => p.id === professionalId);
    if (found) {
      setProfessional(found);
    } else {
      // Handle case where professional is not found
      console.error(`Professional with ID ${professionalId} not found`);
      navigate('/appointments');
    }
  }, [professionalId, navigate]);

  // Format date to YYYY-MM-DD for accessing available time slots
  const formatDateKey = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !professional) return [];
    
    const dateKey = formatDateKey(selectedDate);
    return professional.availableTimeSlots?.[dateKey] || [];
  };

  // Find if a date has available slots (for calendar highlighting)
  const hasAvailableSlots = (date: Date) => {
    if (!professional) return false;
    
    const dateKey = formatDateKey(date);
    return !!professional.availableTimeSlots?.[dateKey]?.length;
  };

  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment",
        variant: "destructive"
      });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedType) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time and appointment type",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the booking information to your backend
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${professional?.name} has been scheduled for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime}.`,
      variant: "default"
    });

    // Navigate to appointments page
    navigate('/appointments');
  };

  // Move to the next step in the booking process
  const handleNextStep = () => {
    if (step === 1 && !selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select an available date",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select an available time slot",
        variant: "destructive"
      });
      return;
    }

    setStep(step + 1);
  };

  if (!professional) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading professional information...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-muted/20 -ml-4" 
            onClick={() => navigate('/appointments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Specialists
          </Button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Professional info column */}
            <div className="md:w-1/3">
              <Card className="sticky top-24">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={professional.photo} 
                      alt={professional.name}
                      className="w-full h-48 object-cover rounded-t-lg" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h2 className="text-xl font-bold">{professional.name}</h2>
                      <p>{professional.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">About</h3>
                    <p className="text-sm text-muted-foreground">{professional.bio}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{professional.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">Generally available: {professional.availability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking column */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-6">Schedule an Appointment</h1>
              
              <div className="mb-8 overflow-hidden rounded-lg border">
                <div className="bg-muted/30 px-4 py-3 font-medium border-b">
                  Booking Steps
                </div>
                <div className="p-0">
                  <div className="flex">
                    <div className={`flex-1 border-r last:border-none py-3 px-4 text-center ${step === 1 ? 'bg-primary/10' : ''}`}>
                      <div className="flex items-center justify-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                        <span className="ml-2 text-sm font-medium">Select Date</span>
                      </div>
                    </div>
                    <div className={`flex-1 border-r last:border-none py-3 px-4 text-center ${step === 2 ? 'bg-primary/10' : ''}`}>
                      <div className="flex items-center justify-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                        <span className="ml-2 text-sm font-medium">Choose Time</span>
                      </div>
                    </div>
                    <div className={`flex-1 last:border-none py-3 px-4 text-center ${step === 3 ? 'bg-primary/10' : ''}`}>
                      <div className="flex items-center justify-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
                        <span className="ml-2 text-sm font-medium">Confirm Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 1: Select Date */}
              {step === 1 && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Select a Date</h3>
                      
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            
                            // Disable dates with no available slots
                            return date < today || !hasAvailableSlots(date);
                          }}
                          className="rounded-md border"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <Button variant="ghost" onClick={() => navigate('/appointments')}>Cancel</Button>
                        <Button onClick={handleNextStep} disabled={!selectedDate}>
                          Continue to Time Selection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Step 2: Select Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Select a Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                        {getAvailableTimeSlots().map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={`flex items-center justify-center h-12 ${selectedTime === time ? '' : 'hover:border-primary hover:text-primary'}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={handleNextStep} disabled={!selectedTime}>
                          Continue to Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Step 3: Appointment Details and Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Select Appointment Type</h3>
                      
                      <Tabs defaultValue="initial" value={selectedType} onValueChange={setSelectedType}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="initial">Initial</TabsTrigger>
                          <TabsTrigger value="followup">Follow-up</TabsTrigger>
                          <TabsTrigger value="assessment">Assessment</TabsTrigger>
                        </TabsList>
                        
                        {APPOINTMENT_TYPES.map((type) => (
                          <TabsContent key={type.id} value={type.id} className="mt-0">
                            <Card className="border-2 border-primary/20">
                              <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{type.name}</h4>
                                    <p className="text-sm text-muted-foreground">{type.duration}</p>
                                  </div>
                                  <div className="text-lg font-semibold">{type.price}</div>
                                </div>
                                <p className="text-sm">{type.description}</p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                      
                      <div className="mt-8 pt-6 border-t">
                        <h3 className="font-medium mb-3">Appointment Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Specialist:</span>
                            <span className="font-medium">{professional.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span>{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span>{APPOINTMENT_TYPES.find(t => t.id === selectedType)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{APPOINTMENT_TYPES.find(t => t.id === selectedType)?.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold">{APPOINTMENT_TYPES.find(t => t.id === selectedType)?.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-8">
                        <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                        <Button onClick={handleBookAppointment}>
                          <Check className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AppointmentBooking;
