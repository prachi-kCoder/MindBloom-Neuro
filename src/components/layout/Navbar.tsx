
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, Menu, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-full bg-soft-purple flex items-center justify-center">
            <span className="text-primary font-bold text-xl">MB</span>
          </div>
          <span className="font-semibold tracking-tight text-lg">MindBloom</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors">
            Resources
          </Link>
          <Link to="/assessment" className="text-sm font-medium hover:text-primary transition-colors">
            Assessment
          </Link>
          <Link to="/appointments" className="text-sm font-medium hover:text-primary transition-colors">
            Appointments
          </Link>
          <Link to="/learning" className="text-sm font-medium hover:text-primary transition-colors">
            Learning
          </Link>
          <Link to="/community" className="text-sm font-medium hover:text-primary transition-colors">
            Community
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link to="/about">
              <Info className="h-4 w-4" />
              <span className="sr-only">About</span>
            </Link>
          </Button>
          
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              className="rounded-full p-0 h-10 w-10 overflow-hidden" 
              onClick={() => navigate('/profile')}
            >
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <Button className="rounded-full bg-primary hover:bg-primary/90" asChild>
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative w-8 h-8 overflow-hidden rounded-full bg-soft-purple flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">MB</span>
                    </div>
                    <span className="font-semibold">MindBloom</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {isAuthenticated && (
                  <div className="py-4 border-b">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar>
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col gap-4 py-6">
                  <Link 
                    to="/resources" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resources
                  </Link>
                  <Link 
                    to="/assessment" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Assessment
                  </Link>
                  <Link 
                    to="/appointments" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link 
                    to="/learning" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Learning
                  </Link>
                  <Link 
                    to="/community" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </nav>
                
                <div className="mt-auto border-t pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Button className="w-full" asChild onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/profile');
                      }}>
                        <Link to="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate('/login');
                      }}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
