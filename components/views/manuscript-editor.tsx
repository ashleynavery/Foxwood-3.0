"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Plus,
  MoreVertical,
  Save,
  History,
  Timer,
  Columns,
  FileText,
  Check,
  Trash2,
  GripVertical,
  RotateCcw
} from "lucide-react"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { SprintTimer } from "@/components/editor/sprint-timer"
import { NotesPanel } from "@/components/editor/notes-panel"

export function ManuscriptEditor() {
  const {
    projects,
    activeProjectId,
    activeChapterId,
    setActiveChapter,
    createChapter,
    updateChapter,
    deleteChapter,
    saveChapterVersion,
    restoreChapterVersion,
    fullscreenMode,
    splitViewOpen,
    setSplitViewOpen
  } = useAppStore()

  const [isNewChapterOpen, setIsNewChapterOpen] = useState(false)
  const [isVersionsOpen, setIsVersionsOpen] = useState(false)
  const [isSprintOpen, setIsSprintOpen] = useState(false)
  const [newChapter, setNewChapter] = useState({ title: "", summary: "", notes: "", povCharacter: "", status: "draft" as const })
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const activeProject = projects.find(p => p.id === activeProjectId)
  const activeChapter = activeProject?.chapters.find(c => c.id === activeChapterId)
  const sortedChapters = activeProject?.chapters.slice().sort((a, b) => a.order - b.order) ?? []
  
  const totalWords = activeProject?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0

  useEffect(() => {
    if (activeProject && !activeChapterId && sortedChapters.length > 0) {
      setActiveChapter(sortedChapters[0].id)
    }
  }, [activeProject, activeChapterId, sortedChapters, setActiveChapter])

  const handleContentChange = useCallback((content: string) => {
    if (!activeProjectId || !activeChapterId) return
    
    setAutoSaveStatus('saving')
    updateChapter(activeProjectId, activeChapterId, { content })
    
    setTimeout(() => {
      setAutoSaveStatus('saved')
    }, 500)
  }, [activeProjectId, activeChapterId, updateChapter])

  const handleCreateChapter = () => {
    if (!activeProjectId || !newChapter.title) return
    
    createChapter(activeProjectId, {
      ...newChapter,
      content: "",
      order: sortedChapters.length + 1
    })
    
    setNewChapter({ title: "", summary: "", notes: "", povCharacter: "", status: "draft" })
    setIsNewChapterOpen(false)
  }

  const handleDeleteChapter = (chapterId: string) => {
    if (!activeProjectId) return
    if (confirm('Are you sure you want to delete this chapter?')) {
      deleteChapter(activeProjectId, chapterId)
    }
  }

  const handleSaveVersion = () => {
    if (!activeProjectId || !activeChapterId) return
    saveChapterVersion(activeProjectId, activeChapterId)
  }

  const handleRestoreVersion = (versionId: string) => {
    if (!activeProjectId || !activeChapterId) return
    restoreChapterVersion(activeProjectId, activeChapterId, versionId)
    setIsVersionsOpen(false)
  }

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project from the dashboard to start writing.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex-1 flex overflow-hidden",
      fullscreenMode && "fixed inset-0 z-50 bg-background"
    )}>
      {!fullscreenMode && (
        <aside className="w-64 border-r border-border flex flex-col bg-muted/30">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-sm">Chapters</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsNewChapterOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {sortedChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={cn(
                    "group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                    chapter.id === activeChapterId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setActiveChapter(chapter.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chapter.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {chapter.wordCount.toLocaleString()} words
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize shrink-0">
                    {chapter.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        if (activeProjectId) {
                          updateChapter(activeProjectId, chapter.id, { status: 'draft' })
                        }
                      }}>
                        Mark as Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        if (activeProjectId) {
                          updateChapter(activeProjectId, chapter.id, { status: 'revised' })
                        }
                      }}>
                        Mark as Revised
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        if (activeProjectId) {
                          updateChapter(activeProjectId, chapter.id, { status: 'final' })
                        }
                      }}>
                        Mark as Final
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {sortedChapters.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No chapters yet</p>
                  <Button variant="link" size="sm" onClick={() => setIsNewChapterOpen(true)}>
                    Create your first chapter
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex justify-between mb-1">
              <span>Total words</span>
              <span className="font-medium">{totalWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Chapters</span>
              <span className="font-medium">{sortedChapters.length}</span>
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background">
          <div className="flex items-center gap-4">
            {activeChapter && (
              <>
                <span className="font-medium">{activeChapter.title}</span>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-muted-foreground">
                  {activeChapter.wordCount.toLocaleString()} words
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mr-2">
              {autoSaveStatus === 'saved' && (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Saved</span>
                </>
              )}
              {autoSaveStatus === 'saving' && (
                <span className="animate-pulse">Saving...</span>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={handleSaveVersion} disabled={!activeChapter}>
              <Save className="h-4 w-4 mr-2" />
              Save Version
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setIsVersionsOpen(true)} disabled={!activeChapter}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setIsSprintOpen(true)}>
              <Timer className="h-4 w-4 mr-2" />
              Sprint
            </Button>
            
            <Button 
              variant={splitViewOpen ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setSplitViewOpen(!splitViewOpen)}
            >
              <Columns className="h-4 w-4 mr-2" />
              Split View
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className={cn("flex-1 overflow-auto", splitViewOpen && "border-r border-border")}>
            {activeChapter ? (
              <RichTextEditor content={activeChapter.content} onChange={handleContentChange} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select or create a chapter to start writing</p>
              </div>
            )}
          </div>
          
          {splitViewOpen && (
            <div className="w-96 overflow-hidden">
              <NotesPanel />
            </div>
          )}
        </div>
      </div>

      <Dialog open={isNewChapterOpen} onOpenChange={setIsNewChapterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Chapter</DialogTitle>
            <DialogDescription>Add a new chapter to your manuscript.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Chapter title"
                value={newChapter.title}
                onChange={(e) => setNewChapter(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">POV Character</label>
              <Select
                value={newChapter.povCharacter}
                onValueChange={(value) => setNewChapter(prev => ({ ...prev, povCharacter: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select POV character" />
                </SelectTrigger>
                <SelectContent>
                  {activeProject?.characters.map((char) => (
                    <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary</label>
              <Input
                placeholder="Brief chapter summary"
                value={newChapter.summary}
                onChange={(e) => setNewChapter(prev => ({ ...prev, summary: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChapterOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChapter} disabled={!newChapter.title}>Create Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>Restore a previous version of this chapter.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2 py-4">
              {activeChapter?.versions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved versions yet.
                </p>
              ) : (
                activeChapter?.versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{new Date(version.savedAt).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{version.wordCount.toLocaleString()} words</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRestoreVersion(version.id)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <SprintTimer open={isSprintOpen} onOpenChange={setIsSprintOpen} />
    </div>
  )
}
