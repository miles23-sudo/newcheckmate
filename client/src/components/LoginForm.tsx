import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { UserRole } from "./RoleSelector";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  selectedRole: UserRole | null;
  onLogin: (data: LoginFormData & { role: UserRole }) => void;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
}

export default function LoginForm({ 
  selectedRole, 
  onLogin, 
  onSwitchToRegister, 
  isLoading = false 
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (!selectedRole) {
      setError("Please select a role first");
      return;
    }
    
    setError(null);
    console.log('Login attempt:', { ...data, role: selectedRole });
    onLogin({ ...data, role: selectedRole });
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'student':
        return 'Student Login';
      case 'instructor':
        return 'Instructor Login';
      case 'administrator':
        return 'Administrator Login';
      default:
        return 'Login';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle data-testid="text-login-title">{getRoleTitle()}</CardTitle>
        {selectedRole && (
          <p className="text-sm text-muted-foreground" data-testid="text-role-context">
            Signing in as {selectedRole}
          </p>
        )}
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" data-testid="alert-login-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              data-testid="input-email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive" data-testid="error-email">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                data-testid="input-password"
                className="pr-10"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive" data-testid="error-password">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !selectedRole}
            data-testid="button-login"
          >
            {isLoading ? (
              "Signing In..."
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <Button 
              type="button" 
              variant="ghost" 
              className="text-sm text-primary" 
              data-testid="link-forgot-password"
            >
              Forgot your password?
            </Button>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                type="button" 
                variant="ghost" 
                className="p-0 h-auto text-primary" 
                onClick={onSwitchToRegister}
                data-testid="link-register"
              >
                Register here
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}