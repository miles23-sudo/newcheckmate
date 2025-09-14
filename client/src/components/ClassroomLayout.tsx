import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  MessageSquare, 
  Search, 
  BookOpen,
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Menu
} from "lucide-react";

interface ClassroomLayoutProps {
  children: React.ReactNode;
  courseId?: string;
}

// Mock student data - matches existing mockStudent
const mockStudent = {
  id: "1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@student.ollc.edu",
  studentId: "OLLC-2024-001",
  role: "student" as const,
};

// Mock courses for dropdown
const mockCourses = [
  { id: "course1", title: "Introduction to Computer Science", code: "CS101" },
  { id: "course2", title: "Advanced Mathematics", code: "MATH301" },
];

export default function ClassroomLayout({ children, courseId = "course1" }: ClassroomLayoutProps) {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const currentCourse = mockCourses.find(c => c.id === courseId) || mockCourses[0];
  
  // Navigation items for sidebar
  const navigationItems = [
    { path: `/class/${courseId}`, label: "Stream", icon: Home, isActive: location === `/class/${courseId}` },
    { path: `/class/${courseId}/classwork`, label: "Classwork", icon: FileText, isActive: location.includes('/classwork') },
    { path: `/class/${courseId}/people`, label: "People", icon: Users, isActive: location.includes('/people') },
    { path: `/class/${courseId}/grades`, label: "Grades", icon: BarChart3, isActive: location.includes('/grades') },
    { path: `/class/${courseId}/reports`, label: "Reports", icon: BookOpen, isActive: location.includes('/reports') },
    { path: `/class/${courseId}/settings`, label: "Settings", icon: Settings, isActive: location.includes('/settings') },
  ];

  // Mock notifications - reduced data for header
  const mockNotifications = [
    { id: "1", title: "New Assignment Posted", message: "Data Structures Project has been posted", isRead: false },
    { id: "2", title: "Grade Released", message: "Your grade for Calculus Problem Set 2 is available", isRead: true },
    { id: "3", title: "Course Announcement", message: "Office hours moved to Thursday 2-4 PM", isRead: false },
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  // Sign out handler
  const handleSignOut = () => {
    // Clear any stored authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Navigate back to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo + Course Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">CHECKmate</span>
            </div>

            {/* Course Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center space-x-2" data-testid="button-course-dropdown">
                  <span className="font-medium">{currentCourse.code}</span>
                  <span className="text-gray-600 dark:text-gray-300">{currentCourse.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {mockCourses.map((course) => (
                  <DropdownMenuItem
                    key={course.id}
                    onClick={() => navigate(`/class/${course.id}`)}
                    data-testid={`option-course-${course.id}`}
                  >
                    <div>
                      <div className="font-medium">{course.code}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{course.title}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments, announcements..."
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-0"
                data-testid="input-global-search"
              />
            </div>
          </div>

          {/* Right: Notifications, Messages, Profile */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <SheetTrigger asChild>
                <div className="relative inline-block">
                  <Button variant="ghost" size="sm" data-testid="button-notifications">
                    <Bell className="h-5 w-5" />
                  </Button>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium z-10">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <div className="space-y-3">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Messages */}
            <Button variant="ghost" size="sm" data-testid="button-messages">
              <MessageSquare className="h-5 w-5" />
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="button-profile-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {mockStudent.firstName[0]}{mockStudent.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <div className="font-medium">{mockStudent.firstName} {mockStudent.lastName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{mockStudent.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{mockStudent.studentId}</div>
                </div>
                <Separator />
                <DropdownMenuItem data-testid="menu-item-profile">My Profile</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-item-settings">Account Settings</DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  data-testid="menu-item-logout" 
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r min-h-[calc(100vh-4rem)] flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={item.isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={item.isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}