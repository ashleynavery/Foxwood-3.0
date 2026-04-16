"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MapPin, BookOpen } from "lucide-react"

export function NotesPanel() {
  const { projects, activeProjectId, activeChapterId } = useAppStore()
  const [activeTab, setActiveTab] = useState("notes")

  const activeProject = projects.find(p => p.id === activeProjectId)
  const activeChapter = activeProject?.chapters.find(c => c.id === activeChapterId)

  if (!activeProject) return null

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border px-2">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger value="notes" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="characters" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Characters
            </TabsTrigger>
            <TabsTrigger value="outline" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Outline
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="notes" className="p-3 mt-0 space-y-3">
            {activeChapter?.notes ? (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Chapter Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{activeChapter.notes}</p>
                </CardContent>
              </Card>
            ) : null}

            {activeProject.notes.slice(0, 5).map((note) => (
              <Card key={note.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                  <div className="flex gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeProject.notes.length === 0 && !activeChapter?.notes && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="p-3 mt-0 space-y-3">
            {activeProject.characters.map((character) => (
              <Card key={character.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{character.name}</CardTitle>
                    <Badge variant="outline" className="text-xs capitalize">
                      {character.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {character.physicalDescription}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {character.personalityTraits.slice(0, 3).map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeProject.characters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No characters yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="outline" className="p-3 mt-0 space-y-3">
            {activeProject.chapters.map((chapter, index) => (
              <Card 
                key={chapter.id}
                className={chapter.id === activeChapterId ? "border-primary" : ""}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Ch. {index + 1}: {chapter.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs capitalize">
                      {chapter.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {chapter.summary || "No summary"}
                  </p>
                </CardContent>
              </Card>
            ))}

            {activeProject.chapters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chapters yet</p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
