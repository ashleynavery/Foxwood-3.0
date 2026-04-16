"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Bot,
  Download,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ChevronDown
} from "lucide-react"

export function MainHeader() {
  const { theme, setTheme } = useTheme()
  const {
    activeView,
    setActiveView,
    rightSidebarOpen,
    setRightSidebarOpen,
    fullscreenMode,
    setFullscreenMode,
    projects,
    activeProjectId,
    setActiveProject
  } = useAppStore()

  const activeProject = projects.find(p => p.id === activeProjectId)
  const totalWords = activeProject?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0
  const progress = activeProject ? Math.round((totalWords / activeProject.targetWordCount) * 100) : 0

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    editor: 'Manuscript Editor',
    storyBible: 'Story Bible',
    outline: 'Outline & Structure',
    research: 'Research & Notes',
    analytics: 'Progress & Analytics'
  }

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {activeProjectId && activeView !== 'dashboard' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{viewTitles[activeView]}</h1>
          
          {activeProject && activeView !== 'dashboard' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {activeProject.title}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className={project.id === activeProjectId ? "bg-accent" : ""}
                  >
                    {project.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {activeProject && activeView !== 'dashboard' && (
          <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
            <span>{totalWords.toLocaleString()} words</span>
            <Badge variant={progress >= 100 ? "default" : "secondary"}>
              {progress}% complete
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {activeView === 'editor' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreenMode(!fullscreenMode)}
          >
            {fullscreenMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as DOCX</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as EPUB</DropdownMenuItem>
            <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export Story Bible (PDF)</DropdownMenuItem>
            <DropdownMenuItem>Export Story Bible (JSON)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Backup to Cloud</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button
          variant={rightSidebarOpen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="gap-2"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>
      </div>
    </header>
  )
}
