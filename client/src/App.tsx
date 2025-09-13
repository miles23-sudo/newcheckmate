import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import InstructorDashboard from "@/pages/InstructorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ClassroomStream from "@/pages/ClassroomStream";
import ClassroomClasswork from "@/pages/ClassroomClasswork";
import ClassroomPeople from "@/pages/ClassroomPeople";
import ClassroomGrades from "@/pages/ClassroomGrades";
import ClassroomReports from "@/pages/ClassroomReports";
import ClassroomSettings from "@/pages/ClassroomSettings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/student-dashboard" component={StudentDashboard} />
      <Route path="/instructor-dashboard" component={InstructorDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      
      {/* Google Classroom-style routes */}
      <Route path="/class/:courseId" component={ClassroomStream} />
      <Route path="/class/:courseId/classwork" component={ClassroomClasswork} />
      <Route path="/class/:courseId/people" component={ClassroomPeople} />
      <Route path="/class/:courseId/grades" component={ClassroomGrades} />
      <Route path="/class/:courseId/reports" component={ClassroomReports} />
      <Route path="/class/:courseId/settings" component={ClassroomSettings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
