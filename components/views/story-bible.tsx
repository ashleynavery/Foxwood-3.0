"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Users,
  MapPin,
  Clock,
  Layers,
  Plus,
  Edit2,
  Trash2,
  User,
  X
} from "lucide-react"
import type { Character, Location, TimelineEvent } from "@/lib/store"

export function StoryBible() {
  const {
    projects,
    activeProjectId,
    activeSubView,
    setActiveSubView,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    createLocation,
    updateLocation,
    deleteLocation,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent
  } = useAppStore()

  const activeProject = projects.find(p => p.id === activeProjectId)

  const [isCharacterOpen, setIsCharacterOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    role: "supporting",
    physicalDescription: "",
    personalityTraits: [],
    backstory: "",
    relationships: [],
    arcNotes: ""
  })

  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    description: "",
    associatedCharacters: [],
    scenesSetHere: []
  })

  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: "",
    description: "",
    date: "",
    characterIds: [],
    type: "plot"
  })

  const [traitInput, setTraitInput] = useState("")

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project to view its story bible.</p>
        </div>
      </div>
    )
  }

  const handleSaveCharacter = () => {
    if (!activeProjectId || !newCharacter.name) return

    if (editingCharacter) {
      updateCharacter(activeProjectId, editingCharacter.id, newCharacter)
    } else {
      createCharacter(activeProjectId, newCharacter as Omit<Character, 'id'>)
    }

    setNewCharacter({
      name: "",
      role: "supporting",
      physicalDescription: "",
      personalityTraits: [],
      backstory: "",
      relationships: [],
      arcNotes: ""
    })
    setEditingCharacter(null)
    setIsCharacterOpen(false)
  }

  const handleSaveLocation = () => {
    if (!activeProjectId || !newLocation.name) return

    if (editingLocation) {
      updateLocation(activeProjectId, editingLocation.id, newLocation)
    } else {
      createLocation(activeProjectId, newLocation as Omit<Location, 'id'>)
    }

    setNewLocation({
      name: "",
      description: "",
      associatedCharacters: [],
      scenesSetHere: []
    })
    setEditingLocation(null)
    setIsLocationOpen(false)
  }

  const handleSaveEvent = () => {
    if (!activeProjectId || !newEvent.title) return

    if (editingEvent) {
      updateTimelineEvent(activeProjectId, editingEvent.id, newEvent)
    } else {
      createTimelineEvent(activeProjectId, newEvent as Omit<TimelineEvent, 'id'>)
    }

    setNewEvent({
      title: "",
      description: "",
      date: "",
      characterIds: [],
      type: "plot"
    })
    setEditingEvent(null)
    setIsEventOpen(false)
  }

  const handleAddTrait = () => {
    if (traitInput.trim()) {
      setNewCharacter(prev => ({
        ...prev,
        personalityTraits: [...(prev.personalityTraits || []), traitInput.trim()]
      }))
      setTraitInput("")
    }
  }

  const handleRemoveTrait = (trait: string) => {
    setNewCharacter(prev => ({
      ...prev,
      personalityTraits: (prev.personalityTraits || []).filter(t => t !== trait)
    }))
  }

  const openEditCharacter = (character: Character) => {
    setEditingCharacter(character)
    setNewCharacter(character)
    setIsCharacterOpen(true)
  }

  const openEditLocation = (location: Location) => {
    setEditingLocation(location)
    setNewLocation(location)
    setIsLocationOpen(true)
  }

  const openEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event)
    setNewEvent(event)
    setIsEventOpen(true)
  }

  const tabs = [
    { id: 'characters', label: 'Characters', icon: Users, count: activeProject.characters.length },
    { id: 'locations', label: 'Locations', icon: MapPin, count: activeProject.locations.length },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: activeProject.timeline.length },
    { id: 'custom', label: 'Custom', icon: Layers, count: activeProject.customCategories.length },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs value={activeSubView} onValueChange={setActiveSubView} className="flex-1 flex flex-col">
        <div className="border-b border-border px-6 pt-4">
          <TabsList>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-6">
          {/* Characters Tab */}
          <TabsContent value="characters" className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Characters</h2>
                <p className="text-muted-foreground text-sm">Manage your story&apos;s cast</p>
              </div>
              <Button onClick={() => {
                setEditingCharacter(null)
                setNewCharacter({
                  name: "",
                  role: "supporting",
                  physicalDescription: "",
                  personalityTraits: [],
                  backstory: "",
                  relationships: [],
                  arcNotes: ""
                })
                setIsCharacterOpen(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProject.characters.map((character) => (
                <Card key={character.id} className="group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{character.name}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="capitalize text-xs">
                              {character.role}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditCharacter(character)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm('Delete this character?')) {
                              deleteCharacter(activeProjectId!, character.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {character.physicalDescription || "No description"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {character.personalityTraits.slice(0, 4).map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                      {character.personalityTraits.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{character.personalityTraits.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeProject.characters.length === 0 && (
                <Card className="col-span-full border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">No characters yet</p>
                    <Button onClick={() => setIsCharacterOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Character
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Locations</h2>
                <p className="text-muted-foreground text-sm">Places in your story world</p>
              </div>
              <Button onClick={() => {
                setEditingLocation(null)
                setNewLocation({
                  name: "",
                  description: "",
                  associatedCharacters: [],
                  scenesSetHere: []
                })
                setIsLocationOpen(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProject.locations.map((location) => (
                <Card key={location.id} className="group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-base">{location.name}</CardTitle>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditLocation(location)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm('Delete this location?')) {
                              deleteLocation(activeProjectId!, location.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {location.description || "No description"}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {activeProject.locations.length === 0 && (
                <Card className="col-span-full border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">No locations yet</p>
                    <Button onClick={() => setIsLocationOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Location
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Timeline</h2>
                <p className="text-muted-foreground text-sm">Plot events and character arcs</p>
              </div>
              <Button onClick={() => {
                setEditingEvent(null)
                setNewEvent({
                  title: "",
                  description: "",
                  date: "",
                  characterIds: [],
                  type: "plot"
                })
                setIsEventOpen(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              
              <div className="space-y-4">
                {activeProject.timeline.map((event) => (
                  <div key={event.id} className="relative pl-14 group">
                    <div className={cn(
                      "absolute left-4 w-4 h-4 rounded-full border-2 bg-background",
                      event.type === 'plot' && "border-primary",
                      event.type === 'character' && "border-accent",
                      event.type === 'world' && "border-muted-foreground"
                    )} />
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="text-xs capitalize mb-2">
                              {event.type}
                            </Badge>
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <CardDescription>{event.date}</CardDescription>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditEvent(event)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                if (confirm('Delete this event?')) {
                                  deleteTimelineEvent(activeProjectId!, event.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {activeProject.timeline.length === 0 && (
                  <Card className="ml-14 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground mb-4">No timeline events yet</p>
                      <Button onClick={() => setIsEventOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Event
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Custom Categories Tab */}
          <TabsContent value="custom" className="mt-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Custom Categories</h2>
                <p className="text-muted-foreground text-sm">Magic systems, factions, objects, and more</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="space-y-6">
              {activeProject.customCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="font-semibold mb-3">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {activeProject.customCategories.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">No custom categories yet</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create a Category
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Character Dialog */}
      <Dialog open={isCharacterOpen} onOpenChange={setIsCharacterOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCharacter ? 'Edit' : 'New'} Character</DialogTitle>
            <DialogDescription>
              Add details about your character.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newCharacter.name || ""}
                  onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Character name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={newCharacter.role}
                  onValueChange={(value) => setNewCharacter(prev => ({ ...prev, role: value as Character['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protagonist">Protagonist</SelectItem>
                    <SelectItem value="antagonist">Antagonist</SelectItem>
                    <SelectItem value="supporting">Supporting</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Physical Description</label>
              <Textarea
                value={newCharacter.physicalDescription || ""}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, physicalDescription: e.target.value }))}
                placeholder="Describe their appearance..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Personality Traits</label>
              <div className="flex gap-2">
                <Input
                  value={traitInput}
                  onChange={(e) => setTraitInput(e.target.value)}
                  placeholder="Add a trait"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTrait()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTrait}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(newCharacter.personalityTraits || []).map((trait) => (
                  <Badge key={trait} variant="secondary" className="gap-1">
                    {trait}
                    <button onClick={() => handleRemoveTrait(trait)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Backstory</label>
              <Textarea
                value={newCharacter.backstory || ""}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, backstory: e.target.value }))}
                placeholder="Their history and background..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Character Arc Notes</label>
              <Textarea
                value={newCharacter.arcNotes || ""}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, arcNotes: e.target.value }))}
                placeholder="How does this character change throughout the story?"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCharacterOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCharacter} disabled={!newCharacter.name}>
              {editingCharacter ? 'Save Changes' : 'Create Character'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={isLocationOpen} onOpenChange={setIsLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit' : 'New'} Location</DialogTitle>
            <DialogDescription>
              Add details about this location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newLocation.name || ""}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Location name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newLocation.description || ""}
                onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this place..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocationOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLocation} disabled={!newLocation.name}>
              {editingLocation ? 'Save Changes' : 'Create Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Event Dialog */}
      <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit' : 'New'} Timeline Event</DialogTitle>
            <DialogDescription>
              Add an event to your story timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newEvent.title || ""}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date/Time</label>
                <Input
                  value={newEvent.date || ""}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., Year 1, Chapter 3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as TimelineEvent['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plot">Plot Event</SelectItem>
                    <SelectItem value="character">Character Arc</SelectItem>
                    <SelectItem value="world">World Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What happens..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent} disabled={!newEvent.title}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
