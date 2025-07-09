
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import ProfessionalCard from './ProfessionalCard';

const professionals = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Child Psychologist',
    specialties: ['ADHD', 'Anxiety', 'Behavioral Issues'],
    rating: 4.9,
    reviewCount: 127,
    location: 'San Francisco, CA',
    experience: '15+ years',
    education: 'Ph.D. in Clinical Psychology from Stanford University',
    languages: ['English', 'Spanish'],
    consultationFee: '$250',
    availableToday: true,
    nextAvailable: 'Today at 3:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: true
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Developmental Pediatrician',
    specialties: ['ASD', 'Developmental Delays', 'Sensory Processing'],
    rating: 4.8,
    reviewCount: 98,
    location: 'San Francisco, CA',
    experience: '12+ years',
    education: 'M.D., Fellowship in Developmental Pediatrics from UCSF',
    languages: ['English', 'Mandarin'],
    consultationFee: '$280',
    availableToday: false,
    nextAvailable: 'Tomorrow at 10:00 AM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: false
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    title: 'Educational Psychologist',
    specialties: ['Dyslexia', 'Learning Disabilities', 'Gifted Assessment'],
    rating: 4.7,
    reviewCount: 156,
    location: 'Oakland, CA',
    experience: '10+ years',
    education: 'Ed.D. in Educational Psychology from UC Berkeley',
    languages: ['English', 'Spanish', 'Portuguese'],
    consultationFee: '$220',
    availableToday: true,
    nextAvailable: 'Today at 5:00 PM',
    image: 'https://images.unsplash.com/photo-1594824388853-5d78f8b1cb9a?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: true
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    title: 'Child Psychiatrist',
    specialties: ['ADHD', 'Mood Disorders', 'Medication Management'],
    rating: 4.9,
    reviewCount: 89,
    location: 'Palo Alto, CA',
    experience: '18+ years',
    education: 'M.D., Board Certified in Child Psychiatry from Johns Hopkins',
    languages: ['English'],
    consultationFee: '$320',
    availableToday: false,
    nextAvailable: 'Monday at 9:00 AM',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: true
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    title: 'Speech-Language Pathologist',
    specialties: ['Language Development', 'Reading Disorders', 'Communication Skills'],
    rating: 4.8,
    reviewCount: 134,
    location: 'San Jose, CA',
    experience: '14+ years',
    education: 'M.S. in Speech-Language Pathology from Northwestern University',
    languages: ['English', 'French'],
    consultationFee: '$190',
    availableToday: true,
    nextAvailable: 'Today at 2:30 PM',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: false
  },
  {
    id: '6',
    name: 'Dr. David Kumar',
    title: 'Pediatric Neurologist',
    specialties: ['Autism Spectrum', 'ADHD', 'Learning Disabilities'],
    rating: 4.6,
    reviewCount: 76,
    location: 'Mountain View, CA',
    experience: '16+ years',
    education: 'M.D., Ph.D. in Neuroscience from Harvard Medical School',
    languages: ['English', 'Hindi'],
    consultationFee: '$300',
    availableToday: false,
    nextAvailable: 'Wednesday at 11:00 AM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: true
  }
];

const ProfessionalDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all-specialties');
  const [selectedLocation, setSelectedLocation] = useState('all-locations');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const specialties = Array.from(
    new Set(professionals.flatMap(p => p.specialties))
  ).sort();

  const locations = Array.from(
    new Set(professionals.map(p => p.location))
  ).sort();

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all-specialties' || professional.specialties.includes(selectedSpecialty);
    const matchesLocation = selectedLocation === 'all-locations' || professional.location === selectedLocation;
    const matchesAvailability = !showAvailableOnly || professional.availableToday;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
  });

  const handleBookAppointment = (professional: any) => {
    navigate(`/appointments/book/${professional.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search professionals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-specialties">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            Available Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing {filteredProfessionals.length} of {professionals.length} professionals</span>
          {(searchTerm || selectedSpecialty !== 'all-specialties' || selectedLocation !== 'all-locations' || showAvailableOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('all-specialties');
                setSelectedLocation('all-locations');
                setShowAvailableOnly(false);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Professional Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfessionals.map(professional => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {filteredProfessionals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No professionals found</p>
            <p>Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDirectory;
