"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, BookOpen, Clock, FileText, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery/Thriller",
  "Romance",
  "Literary Fiction",
  "Historical Fiction",
  "Horror",
  "Young Adult",
  "Middle Grade",
  "Non-Fiction"
]

export function Dashboard() {
  const { projects, createProject, setActiveProject, setActiveView, deleteProject } = useAppStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    genre: "",
    targetWordCount: 80000,
    synopsis: ""
  })

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.genre) return
    
    createProject(newProject)
    setNewProject({ title: "", genre: "", targetWordCount: 80000, synopsis: "" })
    setIsCreateOpen(false)
  }

  const handleOpenProject = (projectId: string) => {
    setActiveProject(projectId)
    setActiveView('editor')
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <p className="text-muted-foreground mt-1">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} in your library
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new writing project. You can always edit these details later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="The Great Novel"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={newProject.genre}
                    onValueChange={(value) => setNewProject(prev => ({ ...prev, genre: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wordCount">Target Word Count</Label>
                  <Input
                    id="wordCount"
                    type="number"
                    value={newProject.targetWordCount}
                    onChange={(e) => setNewProject(prev => ({ ...prev, targetWordCount: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Typical novel: 70,000-100,000 words
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synopsis">Synopsis (Optional)</Label>
                  <Textarea
                    id="synopsis"
                    placeholder="A brief description of your story..."
                    value={newProject.synopsis}
                    onChange={(e) => setNewProject(prev => ({ ...prev, synopsis: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject} disabled={!newProject.title || !newProject.genre}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-sm">
                Create your first project to start writing your novel.
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const totalWords = project.chapters.reduce((sum, ch) => sum + ch.wordCount, 0)
              const progress = Math.round((totalWords / project.targetWordCount) * 100)
              const lastEdited = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })

              return (
                <Card 
                  key={project.id} 
                  className="group hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="text-xs">{project.genre}</Badge>
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleOpenProject(project.id)
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteProject(project.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.synopsis && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.synopsis}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {totalWords.toLocaleString()} / {project.targetWordCount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {project.chapters.length} {project.chapters.length === 1 ? 'chapter' : 'chapters'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lastEdited}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Add Project Card */}
            <Card 
              className="border-dashed hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[220px]"
              onClick={() => setIsCreateOpen(true)}
            >
              <CardContent className="flex flex-col items-center text-muted-foreground">
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">New Project</span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Chapters Quick Access */}
        {projects.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Recent Chapters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {projects
                .flatMap(p => p.chapters.map(ch => ({ ...ch, projectId: p.id, projectTitle: p.title })))
                .sort((a, b) => b.order - a.order)
                .slice(0, 4)
                .map((chapter) => (
                  <Card 
                    key={chapter.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveProject(chapter.projectId)
                      setActiveView('editor')
                    }}
                  >
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{chapter.projectTitle}</p>
                      <p className="font-medium truncate">{chapter.title}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{chapter.wordCount.toLocaleString()} words</span>
                        <Badge variant="outline" className="text-xs capitalize">{chapter.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
