import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Brain, Plus, User } from "lucide-react";
import CourseManagement from "./CourseManagement";
import ThemeToggle from "@/components/ThemeToggle";

// Mock user data - will be replaced with actual authentication
const mockInstructor = {
  id: "1",
  firstName: "Dr. Maria",
  lastName: "Martinez",
  email: "maria.martinez@ollc.edu",
  role: "instructor" as const,
};

export default function InstructorDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'assignments' | 'grading'>('overview');

  // Mock data queries - will be replaced with actual API calls
  const { data: teachingCourses = [] } = useQuery({
    queryKey: ['/api/courses/teaching'],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        title: "Introduction to Computer Science",
        code: "CS101",
        students: 28,
        assignments: 5,
        pendingGrades: 12,
      },
      {
        id: "2",
        title: "Data Structures & Algorithms",
        code: "CS201",
        students: 22,
        assignments: 3,
        pendingGrades: 8,
      },
    ],
  });

  const { data: recentSubmissions = [] } = useQuery({
    queryKey: ['/api/submissions/recent'],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        studentName: "Sarah Johnson",
        assignmentTitle: "Data Structures Project",
        course: "CS101",
        submittedAt: "2024-09-18",
        status: "pending_review",
        aiGrade: 85,
      },
      {
        id: "2",
        studentName: "Michael Chen",
        assignmentTitle: "Algorithm Analysis",
        course: "CS201",
        submittedAt: "2024-09-17",
        status: "ai_graded",
        aiGrade: 92,
      },
    ],
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-courses">{teachingCourses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-students">
              {teachingCourses.reduce((sum, course) => sum + course.students, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-reviews">
              {teachingCourses.reduce((sum, course) => sum + course.pendingGrades, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Graded Today</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-ai-graded">
              {recentSubmissions.filter(s => s.status === 'ai_graded').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest student submissions and AI grading results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium" data-testid={`text-submission-student-${submission.id}`}>
                      {submission.studentName}
                    </p>
                    <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                    <p className="text-xs text-muted-foreground">{submission.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={submission.status === 'ai_graded' ? 'default' : 'secondary'}>
                      {submission.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm font-medium mt-1">AI: {submission.aiGrade}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Your active courses and their statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachingCourses.map((course) => (
                <div key={course.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium" data-testid={`text-course-title-${course.id}`}>
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <Badge variant="outline">{course.students} students</Badge>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{course.assignments} assignments</span>
                    <span>{course.pendingGrades} pending</span>
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
                  {mockInstructor.firstName} {mockInstructor.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">Instructor</p>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <Button data-testid="button-create-course">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
            <Button variant="outline" data-testid="button-logout">
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
              <BookOpen className="mr-2 h-4 w-4" />
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
              variant={selectedTab === 'grading' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('grading')}
              data-testid="button-tab-grading"
            >
              <Brain className="mr-2 h-4 w-4" />
              AI Grading
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'courses' && (
            <CourseManagement />
          )}
          {selectedTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assignments</h2>
                <Button data-testid="button-create-assignment">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Assignment management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
          {selectedTab === 'grading' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">AI Grading Center</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Submission Queue</CardTitle>
                  <CardDescription>Recent submissions processed by our AI grading system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{submission.studentName}</h3>
                          <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                          <p className="text-xs text-muted-foreground">{submission.course} • {submission.submittedAt}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={submission.status === 'ai_graded' ? 'default' : 'secondary'}>
                            {submission.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm font-medium mt-2">AI Score: {submission.aiGrade}%</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Review Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}