import { useParams } from "wouter";
import { useState } from "react";
import ClassroomLayout from "@/components/ClassroomLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Camera, 
  Save, 
  Mail,
  MessageSquare,
  Calendar,
  BookOpen 
} from "lucide-react";

export default function ClassroomSettings() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  // Mock student data
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@student.ollc.edu",
    studentId: "OLLC-2024-001",
    phone: "+1 (555) 123-4567",
    bio: "Computer Science student passionate about software development and AI.",
    avatar: "/api/placeholder/100/100"
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAssignments: true,
    emailGrades: true,
    emailAnnouncements: true,
    pushAssignments: true,
    pushGrades: false,
    pushMessages: true,
    pushDeadlines: true,
    digestWeekly: false,
    digestDaily: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowMessages: true,
    showGrades: false
  });

  const handleSaveProfile = () => {
    // Mock save operation
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    // Mock save operation
    localStorage.setItem('notifications_preferences', JSON.stringify(notifications));
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    // Mock save operation
    localStorage.setItem('privacy_settings', JSON.stringify(privacy));
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password change requested",
      description: "Please check your email for password reset instructions.",
    });
  };

  return (
    <ClassroomLayout courseId={courseId}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" data-testid="button-change-photo">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    JPG, PNG, max 5MB
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    data-testid="input-last-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={profileData.studentId}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                    data-testid="input-student-id"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us a bit about yourself..."
                  data-testid="textarea-bio"
                />
              </div>

              <Button onClick={handleSaveProfile} data-testid="button-save-profile">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about course activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAssignments">New Assignments</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new assignments are posted</p>
                    </div>
                    <Switch
                      id="emailAssignments"
                      checked={notifications.emailAssignments}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailAssignments: checked})}
                      data-testid="switch-email-assignments"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailGrades">Grade Updates</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when grades are released</p>
                    </div>
                    <Switch
                      id="emailGrades"
                      checked={notifications.emailGrades}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailGrades: checked})}
                      data-testid="switch-email-grades"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAnnouncements">Course Announcements</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about course announcements</p>
                    </div>
                    <Switch
                      id="emailAnnouncements"
                      checked={notifications.emailAnnouncements}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailAnnouncements: checked})}
                      data-testid="switch-email-announcements"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Push Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushAssignments">Assignment Reminders</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Remind me about upcoming due dates</p>
                    </div>
                    <Switch
                      id="pushAssignments"
                      checked={notifications.pushAssignments}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushAssignments: checked})}
                      data-testid="switch-push-assignments"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushMessages">New Messages</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new chat messages</p>
                    </div>
                    <Switch
                      id="pushMessages"
                      checked={notifications.pushMessages}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushMessages: checked})}
                      data-testid="switch-push-messages"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Digest Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Digest Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="digestDaily">Daily Summary</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Daily digest of course activities</p>
                    </div>
                    <Switch
                      id="digestDaily"
                      checked={notifications.digestDaily}
                      onCheckedChange={(checked) => setNotifications({...notifications, digestDaily: checked})}
                      data-testid="switch-digest-daily"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="digestWeekly">Weekly Report</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary of progress and achievements</p>
                    </div>
                    <Switch
                      id="digestWeekly"
                      checked={notifications.digestWeekly}
                      onCheckedChange={(checked) => setNotifications({...notifications, digestWeekly: checked})}
                      data-testid="switch-digest-weekly"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications} data-testid="button-save-notifications">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy and visibility in the class
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profileVisible">Profile Visibility</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow other students to see your profile</p>
                </div>
                <Switch
                  id="profileVisible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                  data-testid="switch-profile-visible"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showOnlineStatus">Online Status</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're online</p>
                </div>
                <Switch
                  id="showOnlineStatus"
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={(checked) => setPrivacy({...privacy, showOnlineStatus: checked})}
                  data-testid="switch-online-status"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowMessages">Allow Messages</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow other students to message you</p>
                </div>
                <Switch
                  id="allowMessages"
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                  data-testid="switch-allow-messages"
                />
              </div>

              <Button onClick={handleSavePrivacy} data-testid="button-save-privacy">
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 2 months ago</p>
                </div>
                <Button variant="outline" onClick={handleChangePassword} data-testid="button-change-password">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClassroomLayout>
  );
}