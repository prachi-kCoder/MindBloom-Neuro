
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Clock, Video, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ProfessionalCard = ({ 
  name, 
  specialty, 
  rating, 
  availability 
}: { 
  name: string; 
  specialty: string; 
  rating: number; 
  availability: string;
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{specialty}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" /> {availability}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="flex gap-2">
          <Video className="h-4 w-4" /> View Profile
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Book Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment with {name}</DialogTitle>
              <DialogDescription>
                Select a date and time that works for you.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Calendar mode="single" className="rounded-md border" />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map(time => (
                  <Button key={time} variant="outline" className="w-full">
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const Appointments = () => {
  const [selectedTab, setSelectedTab] = useState("find");
  const [searchTerm, setSearchTerm] = useState("");

  const professionals = [
    { 
      name: "Dr. Sarah Johnson", 
      specialty: "Child Psychologist", 
      rating: 4.9, 
      availability: "Available Mon, Wed, Fri" 
    },
    { 
      name: "Dr. Michael Chen", 
      specialty: "Speech Therapist", 
      rating: 4.7, 
      availability: "Available Tue, Thu" 
    },
    { 
      name: "Dr. Emily Roberts", 
      specialty: "Behavioral Therapist", 
      rating: 4.8, 
      availability: "Available Mon-Fri" 
    },
    { 
      name: "Dr. David Williams", 
      specialty: "Special Education Specialist", 
      rating: 4.6, 
      availability: "Available Wed, Thu, Sat" 
    }
  ];

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
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="find" className="flex items-center gap-2">
                <Search className="h-4 w-4" /> Find Professionals
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Upcoming Appointments
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Past Appointments
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
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="mr-2">Child Psychology</Button>
                      <Button variant="outline" size="sm" className="mr-2">Speech Therapy</Button>
                      <Button variant="outline" size="sm" className="mr-2">Behavioral Therapy</Button>
                      <Button variant="outline" size="sm">Special Education</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Availability:</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="mr-2">This Week</Button>
                      <Button variant="outline" size="sm" className="mr-2">Next Week</Button>
                      <Button variant="outline" size="sm" className="mr-2">Telehealth Only</Button>
                      <Button variant="outline" size="sm">In-Person</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recommended Professionals</h2>
                {professionals.map((professional, index) => (
                  <ProfessionalCard 
                    key={index}
                    name={professional.name}
                    specialty={professional.specialty}
                    rating={professional.rating}
                    availability={professional.availability}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="upcoming">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="mx-auto" />
                  <p className="text-muted-foreground mt-4">You have no upcoming appointments scheduled.</p>
                  <Button className="mt-4">Find Professionals</Button>
                </div>
              </div>
            </TabsContent>

            {/* Past Appointments Tab */}
            <TabsContent value="past">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground mt-4">You have no past appointments.</p>
                  <Button className="mt-4">Find Professionals</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
