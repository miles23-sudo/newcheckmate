import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, FileText, Settings, TrendingUp, Shield, User, Plus } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

// Mock user data - will be replaced with actual authentication
const mockAdmin = {
  id: "1",
  firstName: "Dr. Patricia",
  lastName: "Rodriguez",
  email: "patricia.rodriguez@ollc.edu",
  role: "administrator" as const,
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'courses' | 'reports' | 'settings'>('overview');

  // Mock data queries - will be replaced with actual API calls
  const { data: systemStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: false, // Disabled until backend is ready
    initialData: {
      totalUsers: 156,
      totalStudents: 128,
      totalInstructors: 24,
      totalAdmins: 4,
      totalCourses: 18,
      activeCourses: 15,
      totalAssignments: 87,
      aiGradingUsage: 92.5,
    },
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['/api/admin/activity'],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        type: "user_registration",
        description: "New student registered: Sarah Johnson",
        timestamp: "2024-09-18 14:30",
        status: "completed",
      },
      {
        id: "2",
        type: "course_creation",
        description: "Course created: Advanced Physics by Dr. Chen",
        timestamp: "2024-09-18 13:15",
        status: "completed",
      },
      {
        id: "3",
        type: "ai_grading",
        description: "AI graded 25 assignments in CS101",
        timestamp: "2024-09-18 12:45",
        status: "completed",
      },
    ],
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-users">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-courses">{systemStats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.totalCourses} total courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-assignments">{systemStats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              +8 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-ai-usage">{systemStats.aiGradingUsage}%</div>
            <p className="text-xs text-muted-foreground">
              Grading efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of user roles in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Students</span>
                <Badge variant="secondary" data-testid="text-student-count">{systemStats.totalStudents}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Instructors</span>
                <Badge variant="secondary" data-testid="text-instructor-count">{systemStats.totalInstructors}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Administrators</span>
                <Badge variant="secondary" data-testid="text-admin-count">{systemStats.totalAdmins}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="border-b pb-2 last:border-0">
                  <p className="text-sm font-medium" data-testid={`text-activity-${activity.id}`}>
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" data-testid="button-create-user">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
              <Button className="w-full justify-start" variant="outline" data-testid="button-system-settings">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Button className="w-full justify-start" variant="outline" data-testid="button-view-reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline" data-testid="button-backup-system">
                <Shield className="mr-2 h-4 w-4" />
                Backup System
              </Button>
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
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold" data-testid="text-user-name">
                  {mockAdmin.firstName} {mockAdmin.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">System Administrator</p>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <Button data-testid="button-admin-settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={selectedTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('users')}
              data-testid="button-tab-users"
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
            <Button
              variant={selectedTab === 'courses' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('courses')}
              data-testid="button-tab-courses"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Course Management
            </Button>
            <Button
              variant={selectedTab === 'reports' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('reports')}
              data-testid="button-tab-reports"
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button
              variant={selectedTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('settings')}
              data-testid="button-tab-settings"
            >
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Button data-testid="button-create-user-main">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">User management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
          {selectedTab === 'courses' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Course management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
          {selectedTab === 'reports' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">System Reports</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Reporting dashboard coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
          {selectedTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">System Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">System configuration interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}