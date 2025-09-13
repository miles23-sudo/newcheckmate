import { useParams } from "wouter";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function ClassroomGrades() {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock grades data
  const { data: gradesData } = useQuery({
    queryKey: ['/api/courses', courseId, 'grades'],
    enabled: false,
    initialData: {
      assignments: [
        {
          id: "1",
          title: "Hello World Program",
          dueDate: "2024-09-20",
          submissionDate: "2024-09-18T14:30:00Z",
          aiScore: 92,
          instructorScore: 90,
          finalGrade: 90,
          maxPoints: 10,
          status: "graded"
        },
        {
          id: "2",
          title: "Variables and Data Types", 
          dueDate: "2024-09-25",
          submissionDate: null,
          aiScore: null,
          instructorScore: null,
          finalGrade: null,
          maxPoints: 15,
          status: "not_submitted"
        },
        {
          id: "3",
          title: "Binary Search Tree Implementation",
          dueDate: "2024-10-05",
          submissionDate: "2024-10-03T16:45:00Z",
          aiScore: 88,
          instructorScore: 85,
          finalGrade: 85,
          maxPoints: 50,
          status: "graded"
        },
        {
          id: "4",
          title: "Sorting Algorithms Analysis",
          dueDate: "2024-10-15",
          submissionDate: null,
          aiScore: null,
          instructorScore: null,
          finalGrade: null,
          maxPoints: 30,
          status: "assigned"
        }
      ],
      courseStatistics: {
        currentGrade: 87.5,
        totalPoints: 105,
        earnedPoints: 42.5,
        averageGrade: 82.3,
        classRank: 3,
        totalStudents: 25
      }
    }
  });

  // Progress chart data
  const progressData = [
    { assignment: "Hello World", grade: 90 },
    { assignment: "Variables", grade: null },
    { assignment: "BST", grade: 85 },
    { assignment: "Sorting", grade: null }
  ].filter(item => item.grade !== null);

  // Grade distribution data
  const gradeDistribution = [
    { range: "90-100", count: 8, color: "#22c55e" },
    { range: "80-89", count: 12, color: "#3b82f6" },
    { range: "70-79", count: 4, color: "#f59e0b" },
    { range: "Below 70", count: 1, color: "#ef4444" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge variant="default">Graded</Badge>;
      case "not_submitted":
        return <Badge variant="destructive">Not Submitted</Badge>;
      case "assigned":
        return <Badge variant="outline">Assigned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const downloadReport = () => {
    // Mock CSV generation
    const csvContent = [
      ["Assignment", "Due Date", "AI Score", "Instructor Score", "Final Grade", "Max Points"],
      ...gradesData.assignments.map(assignment => [
        assignment.title,
        assignment.dueDate,
        assignment.aiScore || "N/A",
        assignment.instructorScore || "N/A", 
        assignment.finalGrade || "N/A",
        assignment.maxPoints
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grades_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grades</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">View your performance and progress</p>
          </div>
          <Button onClick={downloadReport} data-testid="button-download-report">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Current Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {gradesData.courseStatistics.currentGrade}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Above average (+{(gradesData.courseStatistics.currentGrade - gradesData.courseStatistics.averageGrade).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Points Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {gradesData.courseStatistics.earnedPoints}/{gradesData.courseStatistics.totalPoints}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total points available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Class Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                #{gradesData.courseStatistics.classRank}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                of {gradesData.courseStatistics.totalStudents} students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Class Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {gradesData.courseStatistics.averageGrade}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Course average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Grade Progress
              </CardTitle>
              <CardDescription>Your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="assignment" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="grade" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Class Grade Distribution
              </CardTitle>
              <CardDescription>How your class is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="count"
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Grades</CardTitle>
            <CardDescription>Detailed breakdown of your assignment scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Assignment</th>
                    <th className="text-left p-2 font-medium">Due Date</th>
                    <th className="text-center p-2 font-medium">AI Score</th>
                    <th className="text-center p-2 font-medium">Instructor Score</th>
                    <th className="text-center p-2 font-medium">Final Grade</th>
                    <th className="text-center p-2 font-medium">Points</th>
                    <th className="text-center p-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesData.assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`grade-row-${assignment.id}`}>
                      <td className="p-2 font-medium">{assignment.title}</td>
                      <td className="p-2 text-gray-600 dark:text-gray-300">{assignment.dueDate}</td>
                      <td className="p-2 text-center">
                        {assignment.aiScore ? (
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {assignment.aiScore}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {assignment.instructorScore ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {assignment.instructorScore}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {assignment.finalGrade ? (
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {assignment.finalGrade}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2 text-center text-gray-600 dark:text-gray-300">
                        {assignment.finalGrade ? 
                          `${(assignment.finalGrade * assignment.maxPoints / 100).toFixed(1)}/${assignment.maxPoints}` :
                          `—/${assignment.maxPoints}`
                        }
                      </td>
                      <td className="p-2 text-center">
                        {getStatusBadge(assignment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClassroomLayout>
  );
}