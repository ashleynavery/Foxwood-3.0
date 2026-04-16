"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Palette,
  Type,
  Save,
  Cloud,
  Download,
  Upload,
  HardDrive,
  Clock,
  Bell,
  Keyboard,
  Monitor,
} from "lucide-react";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

export function SettingsView() {
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState("30");
  const [spellCheck, setSpellCheck] = useState(true);
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState("1000");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Customize your writing environment
          </p>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Save className="h-4 w-4" />
                  Auto-Save
                </CardTitle>
                <CardDescription>
                  Automatically save your work as you write
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autosave">Enable Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Saves your manuscript automatically
                    </p>
                  </div>
                  <Switch
                    id="autosave"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                {autoSave && (
                  <Field>
                    <FieldLabel htmlFor="interval">Save Interval</FieldLabel>
                    <Select value={autoSaveInterval} onValueChange={setAutoSaveInterval}>
                      <SelectTrigger id="interval" className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Every 10 seconds</SelectItem>
                        <SelectItem value="30">Every 30 seconds</SelectItem>
                        <SelectItem value="60">Every minute</SelectItem>
                        <SelectItem value="300">Every 5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Type className="h-4 w-4" />
                  Writing Modes
                </CardTitle>
                <CardDescription>
                  Special modes to help you focus on writing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="typewriter">Typewriter Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep the current line centered on screen
                    </p>
                  </div>
                  <Switch
                    id="typewriter"
                    checked={typewriterMode}
                    onCheckedChange={setTypewriterMode}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="focus">Focus Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Dim paragraphs except the one you&apos;re editing
                    </p>
                  </div>
                  <Switch
                    id="focus"
                    checked={focusMode}
                    onCheckedChange={setFocusMode}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="spellcheck">Spell Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight spelling errors as you type
                    </p>
                  </div>
                  <Switch
                    id="spellcheck"
                    checked={spellCheck}
                    onCheckedChange={setSpellCheck}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription>
                  Quick access to common actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-1">
                    <span>Save</span>
                    <Badge variant="outline">Ctrl + S</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Fullscreen Mode</span>
                    <Badge variant="outline">F11</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Find & Replace</span>
                    <Badge variant="outline">Ctrl + H</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>New Chapter</span>
                    <Badge variant="outline">Ctrl + Shift + N</Badge>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Toggle AI Panel</span>
                    <Badge variant="outline">Ctrl + /</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-4 w-4" />
                  Theme
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Color Theme</FieldLabel>
                    <Select defaultValue="dark">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="sepia">Sepia</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Editor Font</FieldLabel>
                    <Select defaultValue="serif">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Merriweather (Serif)</SelectItem>
                        <SelectItem value="sans">Geist (Sans-serif)</SelectItem>
                        <SelectItem value="mono">Geist Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Font Size</FieldLabel>
                    <Select defaultValue="16">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14">Small (14px)</SelectItem>
                        <SelectItem value="16">Medium (16px)</SelectItem>
                        <SelectItem value="18">Large (18px)</SelectItem>
                        <SelectItem value="20">Extra Large (20px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Line Height</FieldLabel>
                    <Select defaultValue="1.8">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.5">Compact (1.5)</SelectItem>
                        <SelectItem value="1.8">Comfortable (1.8)</SelectItem>
                        <SelectItem value="2.0">Spacious (2.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-4 w-4" />
                  Editor Width
                </CardTitle>
                <CardDescription>
                  Control how wide the writing area appears
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Field>
                  <FieldLabel>Maximum Width</FieldLabel>
                  <Select defaultValue="700">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="600">Narrow (600px)</SelectItem>
                      <SelectItem value="700">Standard (700px)</SelectItem>
                      <SelectItem value="800">Wide (800px)</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HardDrive className="h-4 w-4" />
                  Local Backup
                </CardTitle>
                <CardDescription>
                  Your work is automatically saved to your browser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Last backup: Just now
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Backup
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cloud className="h-4 w-4" />
                  Cloud Sync
                </CardTitle>
                <CardDescription>
                  Sync your projects across devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Cloud className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Cloud Sync Coming Soon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;re working on adding cloud backup and sync capabilities.
                  </p>
                  <Button variant="outline" className="mt-4" disabled>
                    Connect Cloud Storage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Daily Writing Goals
                </CardTitle>
                <CardDescription>
                  Set targets to build your writing habit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="dailyGoal">Daily Word Goal</FieldLabel>
                  <Input
                    id="dailyGoal"
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="w-48"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 500-2000 words per day
                  </p>
                </Field>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Goal Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about your daily writing goal
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-4 w-4" />
                  Streak Tracking
                </CardTitle>
                <CardDescription>
                  Build consistency with daily streaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Streak</p>
                    <p className="text-sm text-muted-foreground">
                      Days in a row meeting your goal
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
