import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import LoginHeader from "@/components/LoginHeader";
import RoleSelector, { UserRole } from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import backgroundImage from "@/assets/3f40ad5d-bf31-41f2-a93b-94f0729fe062.png";
import RegisterForm from "@/components/RegisterForm";

type ViewMode = 'roleSelection' | 'login' | 'register';

export default function Login() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('roleSelection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setViewMode('login');
    console.log('Role selected:', role);
  };

  const handleLogin = async (data: { email: string; password: string; role: UserRole }) => {
    setIsLoading(true);
    console.log('Login attempt:', data);
    
    // TODO: Implement actual authentication
    // For now, simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login successful, redirecting to dashboard...');
      
      // Navigate to appropriate dashboard based on role
      if (data.role === 'student') {
        setLocation('/class/course1');
      } else if (data.role === 'instructor') {
        setLocation('/instructor-dashboard');
      } else if (data.role === 'administrator') {
        setLocation('/admin-dashboard');
      }
    }, 1000);
  };

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    console.log('Registration attempt:', data);
    
    // TODO: Implement actual registration
    // For now, simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration successful, switching to login...');
      setViewMode('login');
    }, 2000);
  };

  const handleBack = () => {
    if (viewMode === 'login' || viewMode === 'register') {
      setViewMode('roleSelection');
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute top-4 right-4 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-200">
          <ThemeToggle />
        </div>
        <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <LoginHeader />
        </div>
        
        {viewMode === 'roleSelection' && (
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />
          </div>
        )}
        
        {viewMode === 'login' && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground p-2"
                data-testid="button-back-to-roles"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to role selection
              </Button>
            </div>
            <LoginForm
              selectedRole={selectedRole}
              onLogin={handleLogin}
              onSwitchToRegister={() => setViewMode('register')}
              isLoading={isLoading}
            />
          </div>
        )}
        
        {viewMode === 'register' && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground p-2"
                data-testid="button-back-to-roles"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to role selection
              </Button>
            </div>
            <RegisterForm
              selectedRole={selectedRole}
              onRegister={handleRegister}
              onSwitchToLogin={() => setViewMode('login')}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}