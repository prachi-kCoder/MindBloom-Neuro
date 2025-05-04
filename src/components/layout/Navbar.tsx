
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
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
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Insights
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
          <Button variant="outline" size="icon" className="md:hidden rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
