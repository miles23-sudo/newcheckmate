import { useState } from "react";
import { useLocation } from "wouter";
import LoginHeader from "@/components/LoginHeader";
import RoleSelector, { UserRole } from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
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
      // TODO: Redirect based on role
      // setLocation(`/${data.role}/dashboard`);
    }, 2000);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        
        {viewMode === 'roleSelection' && (
          <RoleSelector
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
          />
        )}
        
        {viewMode === 'login' && (
          <div className="space-y-4">
            <button
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back-to-roles"
            >
              ← Back to role selection
            </button>
            <LoginForm
              selectedRole={selectedRole}
              onLogin={handleLogin}
              onSwitchToRegister={() => setViewMode('register')}
              isLoading={isLoading}
            />
          </div>
        )}
        
        {viewMode === 'register' && (
          <div className="space-y-4">
            <button
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back-to-roles"
            >
              ← Back to role selection
            </button>
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