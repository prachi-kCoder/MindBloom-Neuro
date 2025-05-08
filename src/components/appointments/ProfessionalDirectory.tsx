
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfessionalCard, { Professional } from './ProfessionalCard';
import { Search, UserRound, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for professionals
const PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Child Psychologist",
    specialties: ["ADHD", "Anxiety", "Behavioral Issues"],
    experience: "15+ years",
    education: "Ph.D. in Clinical Psychology",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    availability: "Mon, Wed, Fri",
    location: "San Francisco, CA",
    bio: "Dr. Johnson specializes in diagnosing and treating ADHD and anxiety disorders in children. She employs a holistic approach, working with parents to develop effective strategies for home and school."
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Developmental Pediatrician",
    specialties: ["ASD", "Developmental Delays", "Sensory Processing"],
    experience: "12+ years",
    education: "M.D., Fellowship in Developmental Pediatrics",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d1d4f9",
    availability: "Tue, Thu, Sat",
    location: "San Francisco, CA",
    bio: "Dr. Chen has extensive experience working with children with autism spectrum disorders. He focuses on early intervention and collaborates with therapists to create comprehensive treatment plans."
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Educational Psychologist",
    specialties: ["Dyslexia", "Learning Disabilities", "Gifted Assessment"],
    experience: "10+ years",
    education: "Ed.D. in Educational Psychology",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
    availability: "Mon, Tue, Thu",
    location: "Oakland, CA",
    bio: "Dr. Rodriguez specializes in identifying and addressing learning disabilities. She works closely with schools to implement accommodations and develop individualized education plans."
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Child Psychiatrist",
    specialties: ["ADHD", "Mood Disorders", "Medication Management"],
    experience: "18+ years",
    education: "M.D., Board Certified in Child Psychiatry",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede",
    availability: "Wed, Fri, Sat",
    location: "Palo Alto, CA",
    bio: "Dr. Wilson provides comprehensive psychiatric evaluations and medication management. He believes in a thoughtful approach to medication, carefully weighing benefits against potential side effects."
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    title: "Speech-Language Pathologist",
    specialties: ["Language Delays", "Articulation Disorders", "Social Communication"],
    experience: "8+ years",
    education: "Ph.D. in Speech-Language Pathology",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=f9c0c0",
    availability: "Mon, Wed, Fri",
    location: "San Jose, CA",
    bio: "Dr. Park specializes in diagnosing and treating communication disorders in children with ASD and developmental delays. She emphasizes functional communication skills for real-world success."
  },
  {
    id: "6",
    name: "Dr. Robert Taylor",
    title: "Occupational Therapist",
    specialties: ["Sensory Integration", "Fine Motor Skills", "Self-Regulation"],
    experience: "14+ years",
    education: "OTD in Occupational Therapy",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=b6e3f4",
    availability: "Tue, Thu, Sat",
    location: "Berkeley, CA",
    bio: "Dr. Taylor helps children develop the skills needed for success in daily activities. He specializes in sensory processing issues and creates personalized treatment plans to improve functional independence."
  }
];

interface ProfessionalDirectoryProps {
  compact?: boolean;
}

const ProfessionalDirectory: React.FC<ProfessionalDirectoryProps> = ({ compact = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  
  // Extract all unique specialties for filter
  const allSpecialties = Array.from(
    new Set(PROFESSIONALS.flatMap(pro => pro.specialties))
  ).sort();
  
  // Extract all unique locations for filter
  const allLocations = Array.from(
    new Set(PROFESSIONALS.map(pro => pro.location.split(',')[1]?.trim() || pro.location))
  ).sort();
  
  // Filter professionals based on search and filters
  const filteredProfessionals = PROFESSIONALS.filter(pro => {
    const matchesSearch = 
      pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.bio.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSpecialty = 
      specialtyFilter === "all" || 
      pro.specialties.includes(specialtyFilter);
      
    const matchesLocation =
      locationFilter === "all" ||
      pro.location.includes(locationFilter);
      
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="space-y-8">
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Find a Specialist</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {allSpecialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {allLocations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Active filters display */}
        {(specialtyFilter !== "all" || locationFilter !== "all" || searchTerm) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:bg-muted/20 rounded-full p-0.5"
                >
                  <span className="sr-only">Remove</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </Badge>
            )}
            
            {specialtyFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Specialty: {specialtyFilter}
                <button 
                  onClick={() => setSpecialtyFilter("all")}
                  className="ml-1 hover:bg-muted/20 rounded-full p-0.5"
                >
                  <span className="sr-only">Remove</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </Badge>
            )}
            
            {locationFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {locationFilter}
                <button 
                  onClick={() => setLocationFilter("all")}
                  className="ml-1 hover:bg-muted/20 rounded-full p-0.5"
                >
                  <span className="sr-only">Remove</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </Badge>
            )}
            
            {(specialtyFilter !== "all" || locationFilter !== "all" || searchTerm) && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSpecialtyFilter("all");
                  setLocationFilter("all");
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Our Specialists {filteredProfessionals.length > 0 && <span className="text-sm font-medium text-muted-foreground">({filteredProfessionals.length} found)</span>}</h2>
      </div>
      
      {filteredProfessionals.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No specialists found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">We couldn't find any specialists matching your search criteria. Please try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map(professional => (
            <ProfessionalCard 
              key={professional.id} 
              professional={professional} 
              compact={compact} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalDirectory;
