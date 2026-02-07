import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Appointments from "@/pages/Appointments";
import AppointmentBooking from "@/pages/AppointmentBooking";
import Assessment from "@/pages/Assessment";
import Resources from "@/pages/Resources";
import SuccessStories from "@/pages/SuccessStories";
import Community from "@/pages/Community";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Learning from "@/pages/Learning";
import LearningActivity from "@/pages/LearningActivity";
import LearningMaterials from "@/pages/LearningMaterials";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/appointments/book/:professionalId" element={<AppointmentBooking />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/success-stories" element={<SuccessStories />} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/learning/:ageGroup/:activityId" element={<LearningActivity />} />
      <Route path="/learning/materials" element={<LearningMaterials />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
