"use client"

import { useState } from "react"
import { useAppStore, type Note, type NoteFolder } from "@/lib/store"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Folder,
  FileText,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Search,
  Tag,
  X,
  FolderPlus,
  Link2
} from "lucide-react"

export function ResearchView() {
  const {
    projects,
    activeProjectId,
    createNote,
    updateNote,
    deleteNote,
    createNoteFolder,
    deleteNoteFolder
  } = useAppStore()

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isFolderOpen, setIsFolderOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [tagInput, setTagInput] = useState("")

  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    folderId: "",
    tags: [],
    linkedChapters: [],
    linkedCharacters: []
  })

  const [newFolderName, setNewFolderName] = useState("")

  const activeProject = projects.find(p => p.id === activeProjectId)

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project to view its research notes.</p>
        </div>
      </div>
    )
  }

  // Get all unique tags
  const allTags = Array.from(new Set(activeProject.notes.flatMap(n => n.tags)))

  // Filter notes
  const filteredNotes = activeProject.notes.filter(note => {
    const matchesFolder = !selectedFolderId || note.folderId === selectedFolderId
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !filterTag || note.tags.includes(filterTag)
    return matchesFolder && matchesSearch && matchesTag
  })

  const handleSaveNote = () => {
    if (!activeProjectId || !newNote.title) return

    if (editingNote) {
      updateNote(activeProjectId, editingNote.id, newNote)
    } else {
      createNote(activeProjectId, {
        ...newNote,
        folderId: newNote.folderId || activeProject.noteFolders[0]?.id || ""
      } as Omit<Note, 'id' | 'createdAt' | 'updatedAt'>)
    }

    setNewNote({
      title: "",
      content: "",
      folderId: "",
      tags: [],
      linkedChapters: [],
      linkedCharacters: []
    })
    setEditingNote(null)
    setIsNoteOpen(false)
  }

  const handleCreateFolder = () => {
    if (!activeProjectId || !newFolderName) return
    createNoteFolder(activeProjectId, { name: newFolderName })
    setNewFolderName("")
    setIsFolderOpen(false)
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }))
  }

  const openEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote(note)
    setIsNoteOpen(true)
  }

  const openNewNote = (folderId?: string) => {
    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      folderId: folderId || activeProject.noteFolders[0]?.id || "",
      tags: [],
      linkedChapters: [],
      linkedCharacters: []
    })
    setIsNoteOpen(true)
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Folders Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-muted/30">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="font-medium text-sm">Folders</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFolderOpen(true)}>
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <Button
              variant={selectedFolderId === null ? "secondary" : "ghost"}
              className="w-full justify-start h-9"
              onClick={() => setSelectedFolderId(null)}
            >
              <FileText className="h-4 w-4 mr-2" />
              All Notes
              <Badge variant="secondary" className="ml-auto text-xs">
                {activeProject.notes.length}
              </Badge>
            </Button>

            {activeProject.noteFolders.map((folder) => {
              const noteCount = activeProject.notes.filter(n => n.folderId === folder.id).length
              return (
                <div key={folder.id} className="group relative">
                  <Button
                    variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-9 pr-8"
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    <span className="truncate">{folder.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {noteCount}
                    </Badge>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openNewNote(folder.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          if (confirm('Delete this folder and all its notes?')) {
                            deleteNoteFolder(activeProjectId!, folder.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Tags */}
        <div className="border-t border-border p-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={filterTag === tag ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
            {allTags.length === 0 && (
              <p className="text-xs text-muted-foreground">No tags yet</p>
            )}
          </div>
        </div>
      </aside>

      {/* Notes List */}
      <div className="flex-1 flex flex-col">
        {/* Search & Actions */}
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {filterTag && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {filterTag}
              <button onClick={() => setFilterTag(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button onClick={() => openNewNote()}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Notes Grid */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditNote(note)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            if (confirm('Delete this note?')) {
                              deleteNote(activeProjectId!, note.id)
                            }
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
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3 whitespace-pre-wrap">
                    {note.content || "No content"}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}

            {filteredNotes.length === 0 && (
              <Card className="col-span-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterTag ? "No notes match your search" : "No notes yet"}
                  </p>
                  {!searchQuery && !filterTag && (
                    <Button onClick={() => openNewNote()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Note Dialog */}
      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit' : 'New'} Note</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Update your note' : 'Create a new research note'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newNote.title || ""}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Note title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newNote.content || ""}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note..."
                rows={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Folder</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={newNote.folderId || ""}
                  onChange={(e) => setNewNote(prev => ({ ...prev, folderId: e.target.value }))}
                >
                  {activeProject.noteFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(newNote.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Link to Characters/Chapters */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Link to Characters
              </label>
              <div className="flex flex-wrap gap-1">
                {activeProject.characters.map((char) => {
                  const isLinked = (newNote.linkedCharacters || []).includes(char.id)
                  return (
                    <Badge
                      key={char.id}
                      variant={isLinked ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setNewNote(prev => ({
                          ...prev,
                          linkedCharacters: isLinked
                            ? (prev.linkedCharacters || []).filter(id => id !== char.id)
                            : [...(prev.linkedCharacters || []), char.id]
                        }))
                      }}
                    >
                      {char.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} disabled={!newNote.title}>
              {editingNote ? 'Save Changes' : 'Create Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Folder Dialog */}
      <Dialog open={isFolderOpen} onOpenChange={setIsFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>Create a new folder to organize your notes.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
