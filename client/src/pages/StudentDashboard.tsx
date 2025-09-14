import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, FileText, BarChart3, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

// Mock user data - will be replaced with actual authentication
const mockStudent = {
  id: "1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@student.ollc.edu",
  studentId: "OLLC-2024-001",
  role: "student" as const,
};

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'assignments' | 'grades'>('overview');

  // Sign out handler
  const handleSignOut = () => {
    // Clear any stored authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Navigate back to login page
    setLocation('/login');
  };

  // Mock data queries - will be replaced with actual API calls
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['/api/courses/enrolled'],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        title: "Introduction to Computer Science",
        code: "CS101",
        instructor: "Dr. Martinez",
        progress: 75,
      },
      {
        id: "2",
        title: "Advanced Mathematics",
        code: "MATH301",
        instructor: "Prof. Chen",
        progress: 60,
      },
    ],
  });

  const { data: recentAssignments = [] } = useQuery({
    queryKey: ['/api/assignments/recent'],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        title: "Data Structures Project",
        course: "CS101",
        dueDate: "2024-09-20",
        status: "submitted",
        score: 85,
      },
      {
        id: "2",
        title: "Calculus Problem Set 3",
        course: "MATH301",
        dueDate: "2024-09-22",
        status: "pending",
        score: null,
      },
    ],
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-enrolled-courses">{enrolledCourses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-assignments">
              {recentAssignments.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-average-grade">85%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-assignments">
              {recentAssignments.filter(a => a.status === 'submitted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>Your latest assignment submissions and grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium" data-testid={`text-assignment-title-${assignment.id}`}>
                      {assignment.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                      {assignment.status}
                    </Badge>
                    {assignment.score && (
                      <p className="text-sm font-medium mt-1">{assignment.score}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Your progress in enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium" data-testid={`text-course-title-${course.id}`}>
                      {course.title}
                    </span>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold" data-testid="text-user-name">
                  {mockStudent.firstName} {mockStudent.lastName}
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-student-id">
                  Student ID: {mockStudent.studentId}
                </p>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" data-testid="button-logout" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)]">
          <nav className="space-y-2 p-4">
            <Button
              variant={selectedTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('overview')}
              data-testid="button-tab-overview"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={selectedTab === 'courses' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('courses')}
              data-testid="button-tab-courses"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </Button>
            <Button
              variant={selectedTab === 'assignments' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('assignments')}
              data-testid="button-tab-assignments"
            >
              <FileText className="mr-2 h-4 w-4" />
              Assignments
            </Button>
            <Button
              variant={selectedTab === 'grades' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('grades')}
              data-testid="button-tab-grades"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Grades
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'courses' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="hover-elevate">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.code} • {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {selectedTab === 'assignments' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Assignments</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">{assignment.course}</p>
                          <p className="text-sm">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                            {assignment.status}
                          </Badge>
                          {assignment.score && (
                            <p className="text-sm font-medium mt-2">Score: {assignment.score}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {selectedTab === 'grades' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Grades</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Detailed grade tracking coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}