import { useParams } from "wouter";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle, AlertCircle, Upload, Bot, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ClassroomClasswork() {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock assignments data organized by topics
  const { data: classworkData = [] } = useQuery({
    queryKey: ['/api/courses', courseId, 'classwork'],
    enabled: false,
    initialData: [
      {
        topicId: "1",
        topicName: "Introduction to Programming",
        assignments: [
          {
            id: "1",
            title: "Hello World Program",
            description: "Create your first program that prints 'Hello, World!' to the console",
            dueDate: "2024-09-20",
            status: "submitted",
            points: 10,
            submissionDate: "2024-09-18T14:30:00Z",
            hasAiFeedback: true,
            plagiarismScore: 95
          },
          {
            id: "2", 
            title: "Variables and Data Types",
            description: "Practice declaring variables and working with different data types",
            dueDate: "2024-09-25",
            status: "assigned",
            points: 15,
            submissionDate: null,
            hasAiFeedback: false,
            plagiarismScore: null
          }
        ]
      },
      {
        topicId: "2",
        topicName: "Data Structures",
        assignments: [
          {
            id: "3",
            title: "Binary Search Tree Implementation",
            description: "Implement a binary search tree with insertion, deletion, and traversal methods",
            dueDate: "2024-10-05",
            status: "returned",
            points: 50,
            submissionDate: "2024-10-03T16:45:00Z",
            hasAiFeedback: true,
            plagiarismScore: 88,
            grade: 85,
            feedback: "Excellent implementation! Consider optimizing the deletion method."
          }
        ]
      },
      {
        topicId: "3",
        topicName: "Algorithms",
        assignments: [
          {
            id: "4",
            title: "Sorting Algorithms Analysis",
            description: "Compare the performance of different sorting algorithms",
            dueDate: "2024-10-15",
            status: "assigned",
            points: 30,
            submissionDate: null,
            hasAiFeedback: false,
            plagiarismScore: null
          }
        ]
      }
    ]
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "returned":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "assigned":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted":
        return "default";
      case "returned":
        return "secondary";
      case "assigned":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "returned":
        return "Returned";
      case "assigned":
        return "Assigned";
      default:
        return "Unknown";
    }
  };

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Classwork</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">View and submit your assignments</p>
        </div>

        {/* Classwork organized by topics */}
        <div className="space-y-8">
          {classworkData.map((topic) => (
            <div key={topic.topicId} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                {topic.topicName}
              </h2>
              
              <div className="grid gap-4">
                {topic.assignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow" data-testid={`assignment-card-${assignment.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <CardTitle className="text-base">{assignment.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {assignment.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(assignment.status)}
                          <Badge variant={getStatusVariant(assignment.status)}>
                            {getStatusLabel(assignment.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        {/* Assignment Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Due:</span> {assignment.dueDate}
                          </div>
                          <div>
                            <span className="font-medium">Points:</span> {assignment.points}
                          </div>
                          {assignment.submissionDate && (
                            <div>
                              <span className="font-medium">Submitted:</span>{" "}
                              {formatDistanceToNow(new Date(assignment.submissionDate), { addSuffix: true })}
                            </div>
                          )}
                          {'grade' in assignment && assignment.grade && (
                            <div>
                              <span className="font-medium">Grade:</span> {assignment.grade}%
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          {assignment.status === "assigned" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" data-testid={`button-submit-work-${assignment.id}`}>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Submit Work
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Submit Assignment</DialogTitle>
                                  <DialogDescription>
                                    Upload your work for "{assignment.title}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Upload File</label>
                                    <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Drop files here or click to browse
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <DialogTrigger asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogTrigger>
                                    <Button>Submit</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {assignment.hasAiFeedback && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-ai-feedback-${assignment.id}`}>
                                  <Bot className="h-4 w-4 mr-2" />
                                  View AI Feedback
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>AI Feedback</DialogTitle>
                                  <DialogDescription>
                                    Automated analysis of your submission
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                      Code Quality Analysis
                                    </h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                      Your code demonstrates good understanding of binary search tree principles. 
                                      The insertion method is well-implemented with proper recursion handling.
                                    </p>
                                  </div>
                                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                                      Strengths
                                    </h4>
                                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                                      <li>• Clear variable naming</li>
                                      <li>• Proper error handling</li>
                                      <li>• Efficient time complexity</li>
                                    </ul>
                                  </div>
                                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                                      Suggestions for Improvement
                                    </h4>
                                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                                      <li>• Consider adding more comments for complex operations</li>
                                      <li>• Optimize the deletion method for better performance</li>
                                    </ul>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {assignment.plagiarismScore !== null && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-plagiarism-report-${assignment.id}`}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Plagiarism Report
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Plagiarism Analysis</DialogTitle>
                                  <DialogDescription>
                                    Originality check for your submission
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                      {assignment.plagiarismScore}%
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      Original Content
                                    </p>
                                  </div>
                                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                                      Analysis Result
                                    </h4>
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                      Your submission shows high originality. No significant similarities 
                                      found with existing sources or other student submissions.
                                    </p>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    This report was generated using AI-powered plagiarism detection.
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>

                      {/* Feedback for returned assignments */}
                      {assignment.status === "returned" && 'feedback' in assignment && assignment.feedback && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Instructor Feedback
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {assignment.feedback}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClassroomLayout>
  );
}