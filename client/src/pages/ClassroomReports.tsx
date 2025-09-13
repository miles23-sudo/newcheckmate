import { useParams } from "wouter";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Brain, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function ClassroomReports() {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock AI reports data
  const { data: reportsData } = useQuery({
    queryKey: ['/api/courses', courseId, 'reports'],
    enabled: false,
    initialData: {
      performanceInsights: {
        overallPerformance: 87.5,
        improvementTrend: "+5.2%",
        strengths: ["Problem-solving", "Code structure", "Algorithm efficiency"],
        improvements: ["Code documentation", "Error handling", "Testing practices"],
        weeklyProgress: [
          { week: "Week 1", score: 82 },
          { week: "Week 2", score: 85 },
          { week: "Week 3", score: 87 },
          { week: "Week 4", score: 90 }
        ]
      },
      plagiarismHistory: [
        {
          id: "1",
          assignmentTitle: "Hello World Program",
          submissionDate: "2024-09-18T14:30:00Z",
          originalityScore: 98,
          status: "clear",
          flaggedSources: 0
        },
        {
          id: "2",
          assignmentTitle: "Binary Search Tree Implementation", 
          submissionDate: "2024-10-03T16:45:00Z",
          originalityScore: 88,
          status: "clear",
          flaggedSources: 2
        },
        {
          id: "3",
          assignmentTitle: "Sorting Algorithms Analysis",
          submissionDate: "2024-10-12T11:20:00Z",
          originalityScore: 75,
          status: "review",
          flaggedSources: 5
        }
      ],
      learningPatterns: {
        studyHours: [
          { day: "Mon", hours: 2.5 },
          { day: "Tue", hours: 3.2 },
          { day: "Wed", hours: 1.8 },
          { day: "Thu", hours: 4.1 },
          { day: "Fri", hours: 2.9 },
          { day: "Sat", hours: 3.5 },
          { day: "Sun", hours: 2.1 }
        ],
        conceptMastery: [
          { concept: "Variables", mastery: 95 },
          { concept: "Functions", mastery: 88 },
          { concept: "Data Structures", mastery: 82 },
          { concept: "Algorithms", mastery: 76 },
          { concept: "Object-Oriented", mastery: 70 }
        ]
      }
    }
  });

  const getOriginalityStatus = (score: number, status: string) => {
    if (status === "review") {
      return <Badge variant="destructive">Under Review</Badge>;
    } else if (score >= 90) {
      return <Badge variant="default" className="bg-green-600">Excellent</Badge>;
    } else if (score >= 80) {
      return <Badge variant="default" className="bg-blue-600">Good</Badge>;
    } else if (score >= 70) {
      return <Badge variant="destructive" className="bg-yellow-600">Caution</Badge>;
    } else {
      return <Badge variant="destructive">Poor</Badge>;
    }
  };

  const getOriginalityIcon = (score: number, status: string) => {
    if (status === "review") {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    } else if (score >= 80) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Performance Reports</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Detailed insights into your learning progress</p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reportsData.performanceInsights.overallPerformance}%
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {reportsData.performanceInsights.improvementTrend} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Weekly Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                Improving
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Consistent upward trajectory
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Academic Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                87%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Average originality score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Progress</CardTitle>
              <CardDescription>Your improvement over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={reportsData.performanceInsights.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[75, 95]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Study Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Hours</CardTitle>
              <CardDescription>Time spent on coursework this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reportsData.learningPatterns.studyHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400">Your Strengths</CardTitle>
              <CardDescription>Areas where you excel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportsData.performanceInsights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 dark:text-green-200 font-medium">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700 dark:text-orange-400">Areas for Improvement</CardTitle>
              <CardDescription>Focus areas to enhance your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportsData.performanceInsights.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600 mr-3" />
                    <span className="text-orange-800 dark:text-orange-200 font-medium">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Concept Mastery */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Concept Mastery</CardTitle>
            <CardDescription>Your understanding level of key course concepts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reportsData.learningPatterns.conceptMastery} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="concept" width={120} />
                <Tooltip />
                <Bar dataKey="mastery" fill="#06b6d4">
                  {reportsData.learningPatterns.conceptMastery.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.mastery >= 80 ? "#10b981" : entry.mastery >= 60 ? "#f59e0b" : "#ef4444"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plagiarism History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Academic Integrity History
            </CardTitle>
            <CardDescription>Plagiarism check results for your submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.plagiarismHistory.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`plagiarism-report-${report.id}`}>
                  <div className="flex items-center space-x-4">
                    {getOriginalityIcon(report.originalityScore, report.status)}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {report.assignmentTitle}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Submitted: {new Date(report.submissionDate).toLocaleDateString()}
                      </p>
                      {report.flaggedSources > 0 && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                          {report.flaggedSources} potential source(s) flagged
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {report.originalityScore}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Original
                      </div>
                    </div>
                    {getOriginalityStatus(report.originalityScore, report.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClassroomLayout>
  );
}