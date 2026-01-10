"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Dumbbell, TrendingUp, Activity, Plus, Search, Settings, LogOut, Menu, X } from "lucide-react"

const dashboardData = [
  { month: "Jan", users: 240, workouts: 380 },
  { month: "Feb", users: 320, workouts: 450 },
  { month: "Mar", users: 380, workouts: 520 },
  { month: "Apr", users: 450, workouts: 620 },
  { month: "May", users: 520, workouts: 750 },
  { month: "Jun", users: 680, workouts: 920 },
]

const exerciseData = [
  { name: "Chest", value: 240, color: "#0088FE" },
  { name: "Back", value: 180, color: "#8B5CF6" },
  { name: "Legs", value: 200, color: "#3B82F6" },
  { name: "Arms", value: 150, color: "#06B6D4" },
  { name: "Cardio", value: 120, color: "#10B981" },
]

const recentWorkouts = [
  { id: 1, user: "John Doe", workout: "Chest Day", exercises: 6, duration: "45 min", date: "2 hours ago" },
  { id: 2, user: "Sarah Smith", workout: "Back & Biceps", exercises: 5, duration: "50 min", date: "4 hours ago" },
  { id: 3, user: "Mike Johnson", workout: "Leg Day", exercises: 7, duration: "60 min", date: "6 hours ago" },
  { id: 4, user: "Emma Wilson", workout: "Full Body", exercises: 8, duration: "55 min", date: "8 hours ago" },
]

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", workouts: 24, status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", workouts: 18, status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", workouts: 31, status: "Active" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", workouts: 12, status: "Inactive" },
  { id: 5, name: "Alex Brown", email: "alex@example.com", workouts: 27, status: "Active" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
          {sidebarOpen && <h1 className="text-xl font-bold text-sidebar-primary">FitAdmin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "users", label: "Users", icon: Users },
            { id: "workouts", label: "Workouts", icon: Dumbbell },
            { id: "exercises", label: "Exercises", icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button className="w-full px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 transition-colors">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button className="w-full px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 transition-colors">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-card-foreground">
            {activeTab === "overview" && "Dashboard"}
            {activeTab === "users" && "Users Management"}
            {activeTab === "workouts" && "Workouts"}
            {activeTab === "exercises" && "Exercises"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8">
          {activeTab === "overview" && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-card-foreground">2,847</div>
                    <p className="text-xs text-muted-foreground mt-1">+240 from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Workouts</CardTitle>
                    <Dumbbell className="w-5 h-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-card-foreground">1,243</div>
                    <p className="text-xs text-muted-foreground mt-1">+58 this week</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Exercises</CardTitle>
                    <Activity className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-card-foreground">156</div>
                    <p className="text-xs text-muted-foreground mt-1">+12 added this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-card-foreground">87%</div>
                    <p className="text-xs text-muted-foreground mt-1">+4% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-card border-border">
                  <CardHeader>
                    <CardTitle>User & Workout Trends</CardTitle>
                    <CardDescription>Monthly growth over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                          labelStyle={{ color: "#F3F4F6" }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={2} name="Users" />
                        <Line type="monotone" dataKey="workouts" stroke="#8B5CF6" strokeWidth={2} name="Workouts" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Popular Exercises</CardTitle>
                    <CardDescription>By muscle group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={exerciseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {exerciseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                          labelStyle={{ color: "#F3F4F6" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                  <CardDescription>Latest completed workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <div>
                          <p className="font-medium text-card-foreground">{workout.user}</p>
                          <p className="text-sm text-muted-foreground">{workout.workout}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-medium text-card-foreground">{workout.exercises} exercises</p>
                            <p className="text-xs text-muted-foreground">{workout.duration}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{workout.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "users" && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage and monitor user accounts</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Workouts</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-background transition-colors">
                          <td className="py-3 px-4 text-sm text-card-foreground">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4 text-sm text-card-foreground">{user.workouts}</td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border hover:bg-background bg-transparent"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "workouts" && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Workouts</CardTitle>
                  <CardDescription>Create and manage workout programs</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Workout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Chest Day", "Back & Biceps", "Leg Day", "Full Body", "Cardio", "Core"].map((workout, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border bg-background hover:border-primary transition-colors cursor-pointer"
                    >
                      <h3 className="font-semibold text-card-foreground mb-2">{workout}</h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Exercises: {5 + i}</p>
                        <p>Difficulty: {["Beginner", "Intermediate", "Advanced"][i % 3]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "exercises" && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Exercise Library</CardTitle>
                  <CardDescription>Manage all available exercises</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Push-ups", "Squats", "Deadlifts", "Bench Press", "Pull-ups", "Burpees"].map((exercise, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border bg-background flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{exercise}</p>
                        <p className="text-xs text-muted-foreground">
                          {["Chest", "Legs", "Back", "Chest", "Back", "Full Body"][i]}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-border hover:bg-background bg-transparent">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
