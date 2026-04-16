"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Target,
  Flame,
  Calendar,
  Trophy,
  Download,
  FileText,
  BookOpen
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"

export function AnalyticsView() {
  const {
    projects,
    activeProjectId,
    dailyWordCounts,
    writingGoal,
    updateWritingGoal,
    sprintSessions
  } = useAppStore()

  const [newDailyTarget, setNewDailyTarget] = useState(writingGoal.dailyTarget.toString())
  const [newDeadline, setNewDeadline] = useState(writingGoal.deadline || "")

  const activeProject = projects.find(p => p.id === activeProjectId)
  const totalWords = activeProject?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0
  const targetWords = activeProject?.targetWordCount ?? 80000
  const progressPercent = Math.round((totalWords / targetWords) * 100)

  // Get last 7 days of word counts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayData = dailyWordCounts.find(d => d.date === dateStr)
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      words: dayData?.count || 0
    }
  })

  // Get monthly data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const monthStr = date.toISOString().slice(0, 7)
    const monthTotal = dailyWordCounts
      .filter(d => d.date.startsWith(monthStr))
      .reduce((sum, d) => sum + d.count, 0)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      words: monthTotal
    }
  })

  // Calculate streak
  const today = new Date().toISOString().split('T')[0]
  const todayWords = dailyWordCounts.find(d => d.date === today)?.count ?? 0
  const metGoalToday = todayWords >= writingGoal.dailyTarget

  // Sprint stats
  const completedSprints = sprintSessions.filter(s => s.wordCountEnd > 0)
  const totalSprintWords = completedSprints.reduce((sum, s) => sum + (s.wordCountEnd - s.wordCountStart), 0)
  const avgWordsPerSprint = completedSprints.length > 0 
    ? Math.round(totalSprintWords / completedSprints.length)
    : 0

  const handleUpdateGoal = () => {
    updateWritingGoal({
      dailyTarget: parseInt(newDailyTarget) || 1000,
      deadline: newDeadline || undefined
    })
  }

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project to view its analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <Tabs defaultValue="progress" className="flex-1 flex flex-col">
        <div className="border-b border-border px-6 pt-4">
          <TabsList>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-6">
          {/* Progress Tab */}
          <TabsContent value="progress" className="mt-0 space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Words</CardDescription>
                  <CardTitle className="text-3xl">{totalWords.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Target: {targetWords.toLocaleString()}</span>
                    <Badge variant={progressPercent >= 100 ? "default" : "secondary"}>
                      {progressPercent}%
                    </Badge>
                  </div>
                  <Progress value={Math.min(progressPercent, 100)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Today&apos;s Words</CardDescription>
                  <CardTitle className="text-3xl">{todayWords.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Goal: {writingGoal.dailyTarget.toLocaleString()}
                    </span>
                    {metGoalToday ? (
                      <Badge className="bg-green-500">Goal Met!</Badge>
                    ) : (
                      <Badge variant="outline">
                        {(writingGoal.dailyTarget - todayWords).toLocaleString()} to go
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Writing Streak</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    {writingGoal.streakDays} days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Keep writing to maintain your streak!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Chapters</CardDescription>
                  <CardTitle className="text-3xl">{activeProject.chapters.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {activeProject.chapters.filter(c => c.status === 'draft').length} draft
                    </Badge>
                    <Badge variant="outline">
                      {activeProject.chapters.filter(c => c.status === 'final').length} final
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Last 7 Days</CardTitle>
                  <CardDescription>Daily word count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={last7Days}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="words" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Trend</CardTitle>
                  <CardDescription>Words written per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="words"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary) / 0.2)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sprint Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sprint Sessions</CardTitle>
                <CardDescription>Writing sprint statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">{completedSprints.length}</p>
                    <p className="text-sm text-muted-foreground">Total Sprints</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalSprintWords.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Words in Sprints</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{avgWordsPerSprint}</p>
                    <p className="text-sm text-muted-foreground">Avg per Sprint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Target</CardTitle>
                  <CardDescription>Set your daily writing goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Words per day</label>
                    <Input
                      type="number"
                      value={newDailyTarget}
                      onChange={(e) => setNewDailyTarget(e.target.value)}
                      min={100}
                    />
                  </div>
                  <Button onClick={handleUpdateGoal}>Update Goal</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deadline</CardTitle>
                  <CardDescription>Set your manuscript deadline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target date</label>
                    <Input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                    />
                  </div>
                  {writingGoal.deadline && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Countdown</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(writingGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        At your current pace, you need ~{Math.ceil((targetWords - totalWords) / writingGoal.dailyTarget)} writing days
                      </p>
                    </div>
                  )}
                  <Button onClick={handleUpdateGoal}>Update Deadline</Button>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
                <CardDescription>Your writing milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'First Words', desc: 'Write your first 100 words', earned: totalWords >= 100 },
                    { name: 'Getting Started', desc: 'Reach 1,000 words', earned: totalWords >= 1000 },
                    { name: 'Chapter One', desc: 'Complete a chapter', earned: activeProject.chapters.some(c => c.status === 'final') },
                    { name: 'On a Roll', desc: '3-day streak', earned: writingGoal.streakDays >= 3 },
                    { name: 'Week Warrior', desc: '7-day streak', earned: writingGoal.streakDays >= 7 },
                    { name: 'Novelist', desc: 'Write 50,000 words', earned: totalWords >= 50000 },
                    { name: 'Sprint Champion', desc: 'Complete 10 sprints', earned: completedSprints.length >= 10 },
                    { name: 'The End', desc: 'Reach your word target', earned: totalWords >= targetWords },
                  ].map((achievement) => (
                    <div
                      key={achievement.name}
                      className={cn(
                        "p-4 rounded-lg border text-center",
                        achievement.earned
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/30 border-border opacity-50"
                      )}
                    >
                      <Trophy className={cn(
                        "h-8 w-8 mx-auto mb-2",
                        achievement.earned ? "text-yellow-500" : "text-muted-foreground"
                      )} />
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Export Manuscript
                  </CardTitle>
                  <CardDescription>Download your complete manuscript</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as DOCX
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as EPUB
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as Markdown
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Export Story Bible
                  </CardTitle>
                  <CardDescription>Download your world-building notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Backup & Sync</CardTitle>
                  <CardDescription>Keep your work safe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Auto-backup to local storage</p>
                      <p className="text-sm text-muted-foreground">Your work is automatically saved locally</p>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      Enabled
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between p-4 border border-dashed rounded-lg">
                    <div>
                      <p className="font-medium">Cloud Sync</p>
                      <p className="text-sm text-muted-foreground">Connect a cloud service for backup</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
