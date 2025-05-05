
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import Assessment from "@/pages/Assessment";
import Resources from "@/pages/Resources";
import SuccessStories from "@/pages/SuccessStories";
import Community from "@/pages/Community";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/success-stories" element={<SuccessStories />} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
