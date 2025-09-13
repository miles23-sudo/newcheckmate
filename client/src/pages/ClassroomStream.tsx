import { useParams } from "wouter";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Pin, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ClassroomStream() {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock announcements data
  const { data: announcements = [] } = useQuery({
    queryKey: ['/api/courses', courseId, 'announcements'],
    enabled: false,
    initialData: [
      {
        id: "1",
        title: "Welcome to Computer Science!",
        content: "Welcome to CS101! This semester we'll be covering fundamental programming concepts, data structures, and algorithms. Please make sure you have your development environment set up and ready to go.",
        authorName: "Dr. Martinez",
        authorRole: "instructor",
        createdAt: "2024-09-10T09:00:00Z",
        isPinned: true,
        commentsCount: 3,
        attachments: []
      },
      {
        id: "2", 
        title: "Assignment 1 Posted",
        content: "Your first assignment on binary search trees is now available in the Classwork section. Due date is September 25th at 11:59 PM. Remember to submit both your code and documentation.",
        authorName: "Dr. Martinez",
        authorRole: "instructor", 
        createdAt: "2024-09-15T14:30:00Z",
        isPinned: false,
        commentsCount: 8,
        attachments: [{ name: "Assignment1_Instructions.pdf", type: "pdf" }]
      },
      {
        id: "3",
        title: "Office Hours Update", 
        content: "This week my office hours will be moved to Thursday 2-4 PM instead of the usual Wednesday slot. See you there!",
        authorName: "Dr. Martinez",
        authorRole: "instructor",
        createdAt: "2024-09-13T11:00:00Z", 
        isPinned: false,
        commentsCount: 1,
        attachments: []
      }
    ]
  });

  // Mock course overview data - reusing existing logic
  const { data: courseOverview } = useQuery({
    queryKey: ['/api/courses', courseId, 'overview'],
    enabled: false,
    initialData: {
      upcomingAssignments: 2,
      pendingSubmissions: 1,
      recentGrades: 1,
      unreadAnnouncements: 1
    }
  });

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Course Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {courseOverview?.upcomingAssignments || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {courseOverview?.pendingSubmissions || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {courseOverview?.recentGrades || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Unread Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {courseOverview?.unreadAnnouncements || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements Stream */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Course Stream</h2>
          
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="relative" data-testid={`announcement-${announcement.id}`}>
              {announcement.isPinned && (
                <div className="absolute top-4 right-4">
                  <Pin className="h-4 w-4 text-blue-600" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {announcement.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base">{announcement.authorName}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {announcement.authorRole}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`button-announcement-menu-${announcement.id}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                  {announcement.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {announcement.content}
                </p>

                {/* Attachments */}
                {announcement.attachments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {announcement.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                        <span className="text-sm font-medium">{attachment.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {attachment.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments section */}
                <div className="flex items-center space-x-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300" data-testid={`button-comment-${announcement.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {announcement.commentsCount} {announcement.commentsCount === 1 ? 'comment' : 'comments'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ClassroomLayout>
  );
}