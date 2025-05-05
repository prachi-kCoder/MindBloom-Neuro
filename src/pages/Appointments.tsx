
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Users, Clock, Video, CalendarIcon, Star, Calendar as CalendarFull, Check, MessageCircle } from 'lucide-react';

// Professional Card Component
const ProfessionalCard = ({ 
  id,
  name, 
  specialty, 
  rating, 
  availability,
  photoUrl
}: { 
  id: string;
  name: string; 
  specialty: string; 
  rating: number; 
  availability: string;
  photoUrl?: string;
}) => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Dummy available times based on professional ID
  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM"
  ];

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12 border">
          {photoUrl ? (
            <AvatarImage src={photoUrl} alt={name} />
          ) : (
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{specialty}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-3">
          <CalendarIcon className="h-4 w-4" /> {availability}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Video className="h-4 w-4" /> View Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{name} - Professional Profile</DialogTitle>
              <DialogDescription>{specialty}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border">
                  {photoUrl ? (
                    <AvatarImage src={photoUrl} alt={name} />
                  ) : (
                    <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">{specialty}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs ml-1">({rating})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">
                    {name} is a highly experienced {specialty.toLowerCase()} with over 10 years of 
                    practice working with children with special needs. Specializes in 
                    evidence-based approaches tailored to each child's unique requirements.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Education & Credentials</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ph.D. in Child Psychology, Stanford University</li>
                    <li>• Licensed Clinical Psychologist</li>
                    <li>• Certified in Cognitive Behavioral Therapy</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">ADHD</Badge>
                    <Badge variant="outline">Autism Spectrum</Badge>
                    <Badge variant="outline">Learning Disabilities</Badge>
                    <Badge variant="outline">Behavioral Issues</Badge>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowBookingDialog(true)}>Book Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment with {name}</DialogTitle>
              <DialogDescription>
                Select a date and time that works for you.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Calendar 
                mode="single" 
                className="rounded-md border" 
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Disable past dates and weekends
                  return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    date.getDay() === 0 || 
                    date.getDay() === 6;
                }}
              />
              
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Available Times</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map(time => (
                      <Button 
                        key={time} 
                        variant={selectedTime === time ? "default" : "outline"} 
                        className="w-full text-sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTime && (
                <div className="mt-4">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1">
                      <Video className="h-4 w-4 mr-2" /> Virtual
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Users className="h-4 w-4 mr-2" /> In-Person
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDate(undefined);
                  setSelectedTime(null);
                }}
                className="sm:mr-auto"
              >
                Reset
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!selectedDate || !selectedTime}>
                    Continue to Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment Information</DialogTitle>
                    <DialogDescription>
                      Complete your appointment booking by providing payment details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="•••" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="w-full">
                      Confirm Booking (${Math.floor(Math.random() * 50) + 100})
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button size="sm" onClick={() => setShowBookingDialog(true)}>Book Appointment</Button>
      </CardFooter>
    </Card>
  );
};

const AppointmentTable = ({ appointments, isPast = false }: { appointments: any[], isPast?: boolean }) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          {isPast ? (
            <Clock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <CalendarFull className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <p className="text-muted-foreground">
          {isPast 
            ? "You have no past appointments." 
            : "You have no upcoming appointments scheduled."}
        </p>
        <Button className="mt-4">Find Professionals</Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Professional</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell className="font-medium flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{appointment.professional.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {appointment.professional}
            </TableCell>
            <TableCell>
              {appointment.date}
              <div className="text-sm text-muted-foreground">{appointment.time}</div>
            </TableCell>
            <TableCell>
              <Badge variant={appointment.type === "Virtual" ? "outline" : "secondary"}>
                {appointment.type === "Virtual" ? (
                  <><Video className="h-3 w-3 mr-1" /> Virtual</>
                ) : (
                  <><Users className="h-3 w-3 mr-1" /> In-Person</>
                )}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {!isPast ? (
                  <>
                    <Button size="sm" variant="outline">Reschedule</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">Join</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join Appointment</DialogTitle>
                          <DialogDescription>Connect with {appointment.professional}</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-6 gap-6">
                          <div className="bg-muted rounded-lg w-full aspect-video flex items-center justify-center">
                            <Video className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click the button below to join your virtual appointment with {appointment.professional}.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button className="w-full">Enter Virtual Room</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline">View Notes</Button>
                    <Button size="sm">Book Again</Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Appointments = () => {
  const [selectedTab, setSelectedTab] = useState("find");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  // Sample data for upcoming and past appointments
  const upcomingAppointments = [
    {
      id: 1,
      professional: "Dr. Sarah Johnson",
      date: "May 10, 2023",
      time: "10:00 AM",
      type: "Virtual",
    },
    {
      id: 2,
      professional: "Dr. David Williams",
      date: "May 15, 2023",
      time: "2:30 PM",
      type: "In-Person",
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      professional: "Dr. Emily Roberts",
      date: "April 20, 2023",
      time: "11:00 AM",
      type: "Virtual",
    }
  ];

  const professionals = [
    { 
      id: "p1",
      name: "Dr. Sarah Johnson", 
      specialty: "Child Psychologist", 
      rating: 4.9, 
      availability: "Available Mon, Wed, Fri" 
    },
    { 
      id: "p2",
      name: "Dr. Michael Chen", 
      specialty: "Speech Therapist", 
      rating: 4.7, 
      availability: "Available Tue, Thu" 
    },
    { 
      id: "p3",
      name: "Dr. Emily Roberts", 
      specialty: "Behavioral Therapist", 
      rating: 4.8, 
      availability: "Available Mon-Fri" 
    },
    { 
      id: "p4",
      name: "Dr. David Williams", 
      specialty: "Special Education Specialist", 
      rating: 4.6, 
      availability: "Available Wed, Thu, Sat" 
    }
  ];

  const filterOptions = [
    "Child Psychology", 
    "Speech Therapy", 
    "Behavioral Therapy", 
    "Special Education"
  ];

  const availabilityOptions = [
    "This Week", 
    "Next Week", 
    "Telehealth Only", 
    "In-Person"
  ];

  const toggleFilter = (filter: string) => {
    if (selectedFilter.includes(filter)) {
      setSelectedFilter(selectedFilter.filter(f => f !== filter));
    } else {
      setSelectedFilter([...selectedFilter, filter]);
    }
  };

  const toggleAvailability = (option: string) => {
    if (selectedAvailability.includes(option)) {
      setSelectedAvailability(selectedAvailability.filter(o => o !== option));
    } else {
      setSelectedAvailability([...selectedAvailability, option]);
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter.length === 0 || 
                          selectedFilter.some(filter => professional.specialty.includes(filter.split(' ')[1]));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Professional Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Connect with specialized professionals to help your child thrive
            </p>
          </div>

          <Tabs defaultValue="find" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="find" className="flex items-center gap-2">
                <Search className="h-4 w-4" /> Find Professionals
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <CalendarFull className="h-4 w-4" /> My Appointments
              </TabsTrigger>
            </TabsList>

            {/* Find Professionals Tab */}
            <TabsContent value="find">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, specialty, or location..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-medium mb-4">Filter By:</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.map(filter => (
                        <Button 
                          key={filter} 
                          variant={selectedFilter.includes(filter) ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => toggleFilter(filter)}
                        >
                          {filter}
                          {selectedFilter.includes(filter) && <Check className="ml-1 h-3 w-3" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Availability:</h3>
                    <div className="flex flex-wrap gap-2">
                      {availabilityOptions.map(option => (
                        <Button 
                          key={option} 
                          variant={selectedAvailability.includes(option) ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleAvailability(option)}
                        >
                          {option}
                          {selectedAvailability.includes(option) && <Check className="ml-1 h-3 w-3" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recommended Professionals</h2>
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <ProfessionalCard 
                      key={professional.id}
                      id={professional.id}
                      name={professional.name}
                      specialty={professional.specialty}
                      rating={professional.rating}
                      availability={professional.availability}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No professionals match your search criteria. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* My Appointments Tab */}
            <TabsContent value="appointments">
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <AppointmentTable appointments={upcomingAppointments} />
                </TabsContent>
                
                <TabsContent value="past">
                  <AppointmentTable appointments={pastAppointments} isPast />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
