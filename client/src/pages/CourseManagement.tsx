import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Plus, Settings, Trash2, Edit } from "lucide-react";
import { insertCourseSchema, type Course, type InsertCourse } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Mock instructor ID - will be replaced with actual authentication
const MOCK_INSTRUCTOR_ID = "instructor-1";

export default function CourseManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Create course form
  const createForm = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      instructorId: MOCK_INSTRUCTOR_ID,
    },
  });

  // Edit course form
  const editForm = useForm<Partial<Course>>({
    resolver: zodResolver(insertCourseSchema.partial()),
    defaultValues: {
      title: "",
      description: "",
      code: "",
    },
  });

  // Fetch instructor's courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses/instructor', MOCK_INSTRUCTOR_ID],
    enabled: false, // Disabled until backend is ready
    initialData: [
      {
        id: "1",
        title: "Introduction to Computer Science",
        description: "A comprehensive introduction to programming concepts and computer science fundamentals.",
        code: "CS101",
        instructorId: MOCK_INSTRUCTOR_ID,
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-09-01"),
      },
      {
        id: "2", 
        title: "Data Structures and Algorithms",
        description: "Advanced study of data structures, algorithms, and their applications in software development.",
        code: "CS201",
        instructorId: MOCK_INSTRUCTOR_ID,
        isActive: true,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-08-15"),
      },
      {
        id: "3",
        title: "Web Development Fundamentals",
        description: "Introduction to modern web development using HTML, CSS, JavaScript, and React.",
        code: "CS301",
        instructorId: MOCK_INSTRUCTOR_ID,
        isActive: false,
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-06-30"),
      },
    ],
  });

  // Mock enrollment data
  const { data: enrollmentData = {} } = useQuery({
    queryKey: ['/api/courses/enrollments'],
    enabled: false,
    initialData: {
      "1": 28,
      "2": 22, 
      "3": 15,
    } as Record<string, number>,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: InsertCourse) => {
      // Mock API call - will be replaced with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now().toString(), ...courseData, isActive: true, createdAt: new Date(), updatedAt: new Date() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses/instructor'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Course Created",
        description: "Your new course has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      // Mock API call - will be replaced with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...updates, updatedAt: new Date() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses/instructor'] });
      setEditingCourse(null);
      editForm.reset();
      toast({
        title: "Course Updated",
        description: "Course has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // Mock API call - will be replaced with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { deleted: true, id: courseId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses/instructor'] });
      toast({
        title: "Course Deleted",
        description: "Course has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateCourse = (data: InsertCourse) => {
    createCourseMutation.mutate(data);
  };

  const handleEditCourse = (data: Partial<Course>) => {
    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, ...data });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    editForm.reset({
      title: course.title,
      description: course.description || "",
      code: course.code,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-muted-foreground">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-course-management">Course Management</h1>
          <p className="text-muted-foreground">Create and manage your courses</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-course">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your teaching portfolio
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateCourse)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Introduction to Computer Science" 
                          data-testid="input-course-title"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CS101" 
                          data-testid="input-course-code"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Course description and objectives..." 
                          data-testid="input-course-description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-create"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createCourseMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-courses">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.isActive).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-students">
              {Object.values(enrollmentData).reduce((sum: number, count: any) => sum + count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-courses">
              {courses.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover-elevate">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg" data-testid={`text-course-title-${course.id}`}>
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </div>
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex justify-between text-sm">
                  <span>Students:</span>
                  <span className="font-medium" data-testid={`text-enrollment-${course.id}`}>
                    {enrollmentData[course.id] || 0}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Created:</span>
                  <span className="text-muted-foreground">
                    {course.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => openEditDialog(course)}
                    data-testid={`button-edit-${course.id}`}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    data-testid={`button-manage-${course.id}`}
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Manage
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteCourse(course.id)}
                    data-testid={`button-delete-${course.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCourse)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Introduction to Computer Science" 
                        data-testid="input-edit-course-title"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="CS101" 
                        data-testid="input-edit-course-code"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Course description and objectives..." 
                        data-testid="input-edit-course-description"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingCourse(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateCourseMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updateCourseMutation.isPending ? "Updating..." : "Update Course"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}