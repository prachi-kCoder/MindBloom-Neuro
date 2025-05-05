
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserPlus, Loader2, Check } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toast } = useToast();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  // Sign in form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    isValid: false
  });
  
  // Check password strength
  useEffect(() => {
    const hasMinLength = registerForm.password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(registerForm.password);
    const hasNumber = /\d/.test(registerForm.password);
    const isValid = hasMinLength && hasUpperCase && hasNumber;
    
    setPasswordStrength({
      hasMinLength,
      hasUpperCase,
      hasNumber,
      isValid
    });
  }, [registerForm.password]);
  
  // Sign in form handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await login(signInForm.email, signInForm.password);
      setFormSubmitted(true);
      
      toast({
        title: "Sign in successful",
        description: "Welcome back to MindBloom!",
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Register form handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      toast({
        title: "Registration failed",
        description: "Please ensure your password meets all requirements",
        variant: "destructive"
      });
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(registerForm.name, registerForm.email, registerForm.password);
      setFormSubmitted(true);
      
      toast({
        title: "Registration successful",
        description: "Welcome to MindBloom!",
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome to MindBloom</h1>
            <p className="text-muted-foreground">Join our community dedicated to neurodevelopmental wellness</p>
          </div>
          
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-4">
              <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin" disabled={isSubmitting}>Sign In</TabsTrigger>
                  <TabsTrigger value="register" disabled={isSubmitting}>Register</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {formSubmitted ? (
                <div className="py-8 text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {activeTab === 'signin' ? 'Sign In Successful!' : 'Registration Complete!'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'signin' 
                      ? 'Welcome back to MindBloom.' 
                      : 'Your account has been created successfully.'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to your profile...
                  </p>
                </div>
              ) : activeTab === 'signin' ? (
                <form onSubmit={handleSignInSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={signInForm.password}
                        onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Jane Doe" 
                        required 
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        required 
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className={`bg-muted/50 ${passwordStrength.isValid ? 'border-green-500' : ''}`}
                      />
                      
                      <div className="mt-2 space-y-2 text-sm">
                        <p className="text-muted-foreground mb-1">Password must have:</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasMinLength ? 'bg-green-500' : 'bg-muted'}`}>
                              {passwordStrength.hasMinLength && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={passwordStrength.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                              At least 8 characters
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-muted'}`}>
                              {passwordStrength.hasUpperCase && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={passwordStrength.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                              At least one uppercase letter
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-muted'}`}>
                              {passwordStrength.hasNumber && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                              At least one number
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        required 
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        className={`bg-muted/50 ${
                          registerForm.confirmPassword && 
                          registerForm.password === registerForm.confirmPassword ? 
                          'border-green-500' : ''
                        }`}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex-col space-y-4 border-t pt-4">
              {!formSubmitted && (
                <div className="text-center text-sm">
                  {activeTab === 'signin' ? (
                    <p>
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => setActiveTab('register')} 
                        className="text-primary hover:underline font-medium"
                        disabled={isSubmitting}
                      >
                        Register
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => setActiveTab('signin')} 
                        className="text-primary hover:underline font-medium"
                        disabled={isSubmitting}
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              )}
              
              <div className="text-center text-xs text-muted-foreground">
                By continuing, you agree to MindBloom's{' '}
                <Link to="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-8 bg-muted/30 rounded-lg p-6 border border-muted">
            <h3 className="font-semibold mb-2">Why Join MindBloom?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Access to personalized neurodevelopmental assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Connect with certified specialists in ADHD, Dyslexia, and ASD</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Join a supportive community of parents and caregivers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Track progress and manage appointments all in one place</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
