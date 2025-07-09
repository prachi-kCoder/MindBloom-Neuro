
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Award, Phone, Video } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  experience: string;
  education: string;
  languages: string[];
  consultationFee: string;
  availableToday: boolean;
  nextAvailable: string;
  image: string;
  verified: boolean;
  telehealth: boolean;
  inPerson: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
  onBookAppointment: (professional: Professional) => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional, 
  onBookAppointment 
}) => {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={professional.image} alt={professional.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {professional.verified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{professional.name}</h3>
                <p className="text-primary font-medium">{professional.title}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-muted-foreground">({professional.reviewCount})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{professional.location}</span>
              <span>•</span>
              <span>{professional.experience}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {professional.specialties.slice(0, 2).map((specialty) => (
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
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-muted-foreground mb-1">Education</p>
            <p className="text-sm">{professional.education}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Languages:</span>
              <span className="text-muted-foreground">
                {professional.languages.join(', ')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-lg text-primary">
                {professional.consultationFee}
              </span>
              <span className="text-muted-foreground"> /session</span>
            </div>
            <div className="flex items-center gap-2">
              {professional.telehealth && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Video className="h-3 w-3" />
                  <span>Video</span>
                </div>
              )}
              {professional.inPerson && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Phone className="h-3 w-3" />
                  <span>In-person</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {professional.availableToday 
                ? "Available today" 
                : `Next available: ${professional.nextAvailable}`
              }
            </span>
          </div>
          
          <Button 
            onClick={() => onBookAppointment(professional)}
            className="w-full mt-4"
            variant={professional.availableToday ? "default" : "outline"}
          >
            {professional.availableToday ? "Book Today" : "Schedule Appointment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
