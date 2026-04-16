"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutGrid,
  List,
  Plus,
  MoreVertical,
  GripVertical,
  Edit2,
  Trash2,
  ListTree
} from "lucide-react"

const BEAT_SHEETS = {
  none: { name: 'None', beats: [] },
  saveTheCat: {
    name: 'Save the Cat',
    beats: [
      { name: 'Opening Image', act: 1, description: 'A snapshot of the protagonist\'s world before the adventure begins.' },
      { name: 'Theme Stated', act: 1, description: 'Someone poses a question or states the theme of the story.' },
      { name: 'Setup', act: 1, description: 'Explore the hero\'s world. Show what\'s missing in their life.' },
      { name: 'Catalyst', act: 1, description: 'The inciting incident. Life will never be the same.' },
      { name: 'Debate', act: 1, description: 'Hero questions whether to accept the challenge.' },
      { name: 'Break into Two', act: 2, description: 'Hero decides to enter the new world.' },
      { name: 'B Story', act: 2, description: 'A new character enters who will help the hero.' },
      { name: 'Fun and Games', act: 2, description: 'The promise of the premise. What we came to see.' },
      { name: 'Midpoint', act: 2, description: 'Stakes are raised. False victory or false defeat.' },
      { name: 'Bad Guys Close In', act: 2, description: 'Things fall apart internally and externally.' },
      { name: 'All Is Lost', act: 2, description: 'The opposite of the Midpoint. Death is present.' },
      { name: 'Dark Night of the Soul', act: 2, description: 'Hero hits rock bottom.' },
      { name: 'Break into Three', act: 3, description: 'Hero finds the solution.' },
      { name: 'Finale', act: 3, description: 'Hero proves they\'ve changed, defeats the bad guys.' },
      { name: 'Final Image', act: 3, description: 'Opposite of the Opening Image. Shows transformation.' },
    ]
  },
  heroJourney: {
    name: "Hero's Journey",
    beats: [
      { name: 'Ordinary World', act: 1, description: 'The hero\'s normal life before the adventure.' },
      { name: 'Call to Adventure', act: 1, description: 'The hero is faced with a challenge.' },
      { name: 'Refusal of the Call', act: 1, description: 'The hero is reluctant at first.' },
      { name: 'Meeting the Mentor', act: 1, description: 'The hero meets someone who gives advice.' },
      { name: 'Crossing the Threshold', act: 2, description: 'The hero commits to the adventure.' },
      { name: 'Tests, Allies, Enemies', act: 2, description: 'The hero faces tests and meets allies and enemies.' },
      { name: 'Approach to the Inmost Cave', act: 2, description: 'The hero approaches the central ordeal.' },
      { name: 'The Ordeal', act: 2, description: 'The hero faces their greatest fear.' },
      { name: 'Reward', act: 2, description: 'The hero takes possession of the reward.' },
      { name: 'The Road Back', act: 3, description: 'The hero begins the journey home.' },
      { name: 'Resurrection', act: 3, description: 'The hero faces a final test.' },
      { name: 'Return with the Elixir', act: 3, description: 'The hero returns home transformed.' },
    ]
  }
}

export function OutlineView() {
  const {
    projects,
    activeProjectId,
    outlineView,
    setOutlineView,
    beatSheetPreset,
    setBeatSheetPreset,
    updateChapter,
    setActiveChapter,
    setActiveView
  } = useAppStore()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<{
    id: string
    title: string
    summary: string
    notes: string
    status: 'draft' | 'revised' | 'final'
  } | null>(null)

  const activeProject = projects.find(p => p.id === activeProjectId)
  const sortedChapters = activeProject?.chapters.slice().sort((a, b) => a.order - b.order) ?? []
  const activeBeatSheet = BEAT_SHEETS[beatSheetPreset]

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <ListTree className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project to view its outline.</p>
        </div>
      </div>
    )
  }

  const openEditChapter = (chapter: typeof sortedChapters[0]) => {
    setEditingChapter({
      id: chapter.id,
      title: chapter.title,
      summary: chapter.summary,
      notes: chapter.notes,
      status: chapter.status
    })
    setIsEditOpen(true)
  }

  const handleSaveChapter = () => {
    if (!activeProjectId || !editingChapter) return
    updateChapter(activeProjectId, editingChapter.id, {
      title: editingChapter.title,
      summary: editingChapter.summary,
      notes: editingChapter.notes,
      status: editingChapter.status
    })
    setIsEditOpen(false)
    setEditingChapter(null)
  }

  const goToChapter = (chapterId: string) => {
    setActiveChapter(chapterId)
    setActiveView('editor')
  }

  // Group chapters by act
  const chaptersByAct = {
    1: sortedChapters.filter((_, i) => i < Math.ceil(sortedChapters.length / 4)),
    2: sortedChapters.filter((_, i) => i >= Math.ceil(sortedChapters.length / 4) && i < Math.ceil(sortedChapters.length * 3 / 4)),
    3: sortedChapters.filter((_, i) => i >= Math.ceil(sortedChapters.length * 3 / 4))
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Story Outline</h2>
          <Select value={beatSheetPreset} onValueChange={(v) => setBeatSheetPreset(v as typeof beatSheetPreset)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Beat Sheet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Template</SelectItem>
              <SelectItem value="saveTheCat">Save the Cat</SelectItem>
              <SelectItem value="heroJourney">Hero&apos;s Journey</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={outlineView === 'kanban' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setOutlineView('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={outlineView === 'linear' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setOutlineView('linear')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        {outlineView === 'kanban' ? (
          /* Kanban View - Three Act Structure */
          <div className="grid grid-cols-3 gap-6 min-h-full">
            {[1, 2, 3].map((act) => (
              <div key={act} className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Act {act}</h3>
                  <Badge variant="outline">
                    {chaptersByAct[act as 1 | 2 | 3].length} chapters
                  </Badge>
                </div>

                {/* Beat Sheet Overlay */}
                {beatSheetPreset !== 'none' && (
                  <div className="mb-4 space-y-2">
                    {activeBeatSheet.beats
                      .filter(beat => beat.act === act)
                      .map((beat, i) => (
                        <div
                          key={i}
                          className="p-2 rounded border border-dashed border-muted-foreground/30 bg-muted/30"
                        >
                          <p className="text-xs font-medium text-muted-foreground">{beat.name}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{beat.description}</p>
                        </div>
                      ))}
                  </div>
                )}

                <div className="space-y-3 flex-1">
                  {chaptersByAct[act as 1 | 2 | 3].map((chapter) => (
                    <Card key={chapter.id} className="group cursor-pointer hover:border-primary/50">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm truncate">{chapter.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {chapter.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {chapter.wordCount.toLocaleString()} words
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => goToChapter(chapter.id)}>
                                Open in Editor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditChapter(chapter)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0" onClick={() => goToChapter(chapter.id)}>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {chapter.summary || "No summary"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Linear View */
          <div className="max-w-3xl mx-auto space-y-4">
            {beatSheetPreset !== 'none' && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Beat Sheet: {activeBeatSheet.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeBeatSheet.beats.map((beat, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                        <Badge variant="outline" className="shrink-0">Act {beat.act}</Badge>
                        <div>
                          <p className="font-medium text-sm">{beat.name}</p>
                          <p className="text-xs text-muted-foreground">{beat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sortedChapters.map((chapter, index) => (
              <Card key={chapter.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{chapter.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="capitalize">{chapter.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {chapter.wordCount.toLocaleString()} words
                        </span>
                        {chapter.povCharacter && (
                          <span className="text-sm text-muted-foreground">
                            POV: {activeProject.characters.find(c => c.id === chapter.povCharacter)?.name || 'Unknown'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToChapter(chapter.id)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditChapter(chapter)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{chapter.summary || "No summary"}</p>
                  {chapter.notes && (
                    <div className="p-3 bg-muted rounded-lg mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{chapter.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {sortedChapters.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ListTree className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">No chapters in your outline yet</p>
                  <Button onClick={() => setActiveView('editor')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Chapter
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Edit Chapter Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter Details</DialogTitle>
            <DialogDescription>Update the chapter&apos;s outline information.</DialogDescription>
          </DialogHeader>
          {editingChapter && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingChapter.title}
                  onChange={(e) => setEditingChapter(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editingChapter.status}
                  onValueChange={(value) => setEditingChapter(prev => prev ? { ...prev, status: value as typeof editingChapter.status } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="revised">Revised</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <Textarea
                  value={editingChapter.summary}
                  onChange={(e) => setEditingChapter(prev => prev ? { ...prev, summary: e.target.value } : null)}
                  placeholder="Brief chapter summary..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={editingChapter.notes}
                  onChange={(e) => setEditingChapter(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  placeholder="Writing notes..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChapter}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
