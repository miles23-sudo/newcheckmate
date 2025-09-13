import { useParams } from "wouter";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Bot, Mail, Users } from "lucide-react";

export default function ClassroomPeople() {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock people data
  const { data: peopleData } = useQuery({
    queryKey: ['/api/courses', courseId, 'people'],
    enabled: false,
    initialData: {
      instructors: [
        {
          id: "instructor1",
          firstName: "Dr. Maria",
          lastName: "Martinez",
          email: "maria.martinez@ollc.edu",
          role: "instructor",
          avatar: "/api/placeholder/40/40",
          isOnline: true
        }
      ],
      students: [
        {
          id: "student1",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@student.ollc.edu", 
          role: "student",
          avatar: "/api/placeholder/40/40",
          isOnline: true
        },
        {
          id: "student2", 
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@student.ollc.edu",
          role: "student",
          avatar: "/api/placeholder/40/40",
          isOnline: false
        },
        {
          id: "student3",
          firstName: "Emily",
          lastName: "Rodriguez", 
          email: "emily.rodriguez@student.ollc.edu",
          role: "student",
          avatar: "/api/placeholder/40/40",
          isOnline: true
        },
        {
          id: "student4",
          firstName: "David",
          lastName: "Kim",
          email: "david.kim@student.ollc.edu",
          role: "student", 
          avatar: "/api/placeholder/40/40",
          isOnline: false
        }
      ]
    }
  });

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">People</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">View classmates and instructors</p>
        </div>

        {/* AI Study Assistant */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900 dark:text-blue-100">AI Study Assistant</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Get instant help with course materials and assignments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-ai-assistant">
                  <Bot className="h-4 w-4 mr-2" />
                  Open AI Assistant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>AI Study Assistant</DialogTitle>
                  <DialogDescription>
                    Ask questions about course materials, get help with assignments, or request explanations
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[300px]">
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <p>AI Assistant is ready to help!</p>
                      <p className="text-sm mt-2">Ask me anything about your coursework.</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      placeholder="Type your question here..."
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button>Send</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Instructors Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Instructors
          </h2>
          <div className="grid gap-4">
            {peopleData.instructors.map((instructor) => (
              <Card key={instructor.id} data-testid={`instructor-card-${instructor.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={instructor.avatar} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {instructor.firstName[0]}{instructor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {instructor.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {instructor.firstName} {instructor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{instructor.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          {instructor.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid={`button-message-instructor-${instructor.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Message {instructor.firstName} {instructor.lastName}</DialogTitle>
                            <DialogDescription>
                              Send a private message to your instructor
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Subject</label>
                              <input 
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter message subject"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <textarea 
                                rows={4}
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message here..."
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <DialogTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogTrigger>
                              <Button>Send Message</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Classmates ({peopleData.students.length})
          </h2>
          <div className="grid gap-4">
            {peopleData.students.map((student) => (
              <Card key={student.id} data-testid={`student-card-${student.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-gray-600 text-white">
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {student.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.isOnline ? (
                        <Badge variant="default" className="bg-green-600">
                          Online
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ClassroomLayout>
  );
}