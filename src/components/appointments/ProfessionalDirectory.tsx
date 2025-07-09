
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfessionalCard from './ProfessionalCard';

const professionals = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Pediatric Developmental Specialist',
    specialties: ['Dyslexia Assessment', 'ADHD Evaluation', 'Learning Disabilities', 'Behavioral Therapy'],
    rating: 4.9,
    reviewCount: 127,
    location: 'New York, NY',
    experience: '12 years experience',
    education: 'MD from Harvard Medical School, PhD in Developmental Psychology',
    languages: ['English', 'Spanish'],
    consultationFee: '$180',
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
    title: 'Child Neuropsychologist',
    specialties: ['Autism Spectrum Disorders', 'ADHD', 'Executive Function', 'Memory Assessment'],
    rating: 4.8,
    reviewCount: 98,
    location: 'Los Angeles, CA',
    experience: '15 years experience',
    education: 'PhD in Clinical Psychology, UCLA School of Medicine',
    languages: ['English', 'Mandarin'],
    consultationFee: '$200',
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
    specialties: ['Learning Assessments', 'IEP Planning', 'School Accommodations', 'Study Skills'],
    rating: 4.7,
    reviewCount: 156,
    location: 'Chicago, IL',
    experience: '10 years experience',
    education: 'EdD in Educational Psychology, Teachers College Columbia',
    languages: ['English', 'Spanish', 'Portuguese'],
    consultationFee: '$150',
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
    title: 'Behavioral Therapist',
    specialties: ['Applied Behavior Analysis', 'Social Skills Training', 'Autism Support', 'Family Counseling'],
    rating: 4.9,
    reviewCount: 89,
    location: 'Austin, TX',
    experience: '8 years experience',
    education: 'PhD in Applied Behavior Analysis, University of Kansas',
    languages: ['English'],
    consultationFee: '$160',
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
    specialties: ['Language Development', 'Reading Disorders', 'Communication Skills', 'Articulation'],
    rating: 4.8,
    reviewCount: 134,
    location: 'Seattle, WA',
    experience: '14 years experience',
    education: 'MS in Speech-Language Pathology, University of Washington',
    languages: ['English', 'French'],
    consultationFee: '$140',
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
    title: 'Pediatric Psychiatrist',
    specialties: ['ADHD Medication', 'Anxiety Disorders', 'Mood Disorders', 'Medication Management'],
    rating: 4.6,
    reviewCount: 76,
    location: 'Boston, MA',
    experience: '18 years experience',
    education: 'MD from Johns Hopkins, Residency in Child Psychiatry',
    languages: ['English', 'Hindi'],
    consultationFee: '$220',
    availableToday: false,
    nextAvailable: 'Wednesday at 11:00 AM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    verified: true,
    telehealth: true,
    inPerson: true
  }
];

const ProfessionalDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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
    
    const matchesSpecialty = !selectedSpecialty || professional.specialties.includes(selectedSpecialty);
    const matchesLocation = !selectedLocation || professional.location === selectedLocation;
    const matchesAvailability = !showAvailableOnly || professional.availableToday;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
  });

  const handleBookAppointment = (professional: any) => {
    // Handle appointment booking
    console.log('Booking appointment with:', professional.name);
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
              <SelectItem value="">All Specialties</SelectItem>
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
              <SelectItem value="">All Locations</SelectItem>
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
          {(searchTerm || selectedSpecialty || selectedLocation || showAvailableOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setSelectedLocation('');
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
