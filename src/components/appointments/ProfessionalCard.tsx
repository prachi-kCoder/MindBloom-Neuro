
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export interface Professional {
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

interface ProfessionalCardProps {
  professional: Professional;
  compact?: boolean;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  compact = false
}) => {
  const navigate = useNavigate();
  
  const handleBookAppointment = () => {
    navigate(`/appointments/book/${professional.id}`);
  };
  
  if (compact) {
    return (
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <img 
              src={professional.photo} 
              alt={professional.name}
              className="w-12 h-12 rounded-full object-cover" 
            />
            <div>
              <h3 className="font-medium">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.title}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {professional.specialties.slice(0, 2).map(specialty => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {professional.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{professional.specialties.length - 2} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">{professional.availability}</div>
          <Button size="sm" variant="secondary" onClick={handleBookAppointment}>
            Book
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img 
            src={professional.photo} 
            alt={`Dr. ${professional.name}`}
            className="w-full h-52 object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="text-white text-xl font-bold">{professional.name}</h3>
            <p className="text-white/90 text-sm">{professional.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {professional.specialties.map(specialty => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">About</h4>
            <p className="text-muted-foreground text-sm mt-1">{professional.bio}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Experience</h4>
              <p className="text-muted-foreground text-sm mt-1">{professional.experience}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Education</h4>
              <p className="text-muted-foreground text-sm mt-1">{professional.education}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Availability</h4>
              <p className="text-muted-foreground text-sm mt-1">{professional.availability}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Location</h4>
              <p className="text-muted-foreground text-sm mt-1">{professional.location}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={handleBookAppointment}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
