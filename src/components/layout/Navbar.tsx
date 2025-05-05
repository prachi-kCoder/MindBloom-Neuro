
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden rounded-full bg-soft-purple flex items-center justify-center">
            <span className="text-primary font-bold text-xl">FL</span>
          </div>
          <span className="font-semibold tracking-tight text-lg">Feed Lovable</span>
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
          <Button className="rounded-full bg-primary hover:bg-primary/90" asChild>
            <Link to="/login">
              Sign In
            </Link>
          </Button>
          
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
                      <span className="text-primary font-bold text-xl">FL</span>
                    </div>
                    <span className="font-semibold">Feed Lovable</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
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
                  <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/login">Sign In</Link>
                  </Button>
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
