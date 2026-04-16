import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Character {
  id: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  imageUrl?: string
  physicalDescription: string
  personalityTraits: string[]
  backstory: string
  relationships: { characterId: string; relationship: string }[]
  arcNotes: string
}

export interface Location {
  id: string
  name: string
  imageUrl?: string
  description: string
  associatedCharacters: string[]
  scenesSetHere: string[]
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  chapterId?: string
  characterIds: string[]
  type: 'plot' | 'character' | 'world'
}

export interface CustomCategory {
  id: string
  name: string
  items: {
    id: string
    name: string
    description: string
    imageUrl?: string
    linkedCharacters: string[]
    linkedLocations: string[]
  }[]
}

export interface Note {
  id: string
  title: string
  content: string
  folderId: string
  tags: string[]
  linkedChapters: string[]
  linkedCharacters: string[]
  createdAt: string
  updatedAt: string
}

export interface NoteFolder {
  id: string
  name: string
  parentId?: string
}

export interface Chapter {
  id: string
  title: string
  content: string
  wordCount: number
  status: 'draft' | 'revised' | 'final'
  povCharacter?: string
  summary: string
  notes: string
  order: number
  versions: {
    id: string
    content: string
    savedAt: string
    wordCount: number
  }[]
}

export interface Project {
  id: string
  title: string
  genre: string
  targetWordCount: number
  synopsis: string
  createdAt: string
  updatedAt: string
  chapters: Chapter[]
  characters: Character[]
  locations: Location[]
  timeline: TimelineEvent[]
  customCategories: CustomCategory[]
  notes: Note[]
  noteFolders: NoteFolder[]
}

export interface OutlineCard {
  id: string
  chapterId?: string
  title: string
  povCharacter?: string
  summary: string
  status: 'draft' | 'revised' | 'final'
  notes: string
  order: number
  act: 1 | 2 | 3
}

export interface DailyWordCount {
  date: string
  count: number
}

export interface WritingGoal {
  dailyTarget: number
  deadline?: string
  streakDays: number
  lastWritingDate?: string
}

export interface SprintSession {
  id: string
  startTime: string
  duration: number // in minutes
  wordCountStart: number
  wordCountEnd: number
  goalWords: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AIAgent {
  id: string
  name: string
  description: string
  icon: string
  systemPrompt: string
}

export type AIContextMode = 'chapter' | 'manuscript' | 'storyBible'

// Store State
interface AppState {
  // UI State
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  activeView: 'dashboard' | 'editor' | 'storyBible' | 'outline' | 'research' | 'analytics'
  activeSubView: string
  fullscreenMode: boolean
  splitViewOpen: boolean
  
  // Projects
  projects: Project[]
  activeProjectId: string | null
  activeChapterId: string | null
  
  // Outline
  outlineCards: OutlineCard[]
  outlineView: 'kanban' | 'linear'
  beatSheetPreset: 'none' | 'saveTheCat' | 'heroJourney'
  
  // Progress
  dailyWordCounts: DailyWordCount[]
  writingGoal: WritingGoal
  sprintSessions: SprintSession[]
  activeSprintId: string | null
  
  // AI
  activeAgentId: string
  aiMessages: Record<string, AIMessage[]>
  aiContextMode: AIContextMode
  
  // Actions
  setLeftSidebarOpen: (open: boolean) => void
  setRightSidebarOpen: (open: boolean) => void
  setActiveView: (view: AppState['activeView']) => void
  setActiveSubView: (subView: string) => void
  setFullscreenMode: (fullscreen: boolean) => void
  setSplitViewOpen: (open: boolean) => void
  
  // Project Actions
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'chapters' | 'characters' | 'locations' | 'timeline' | 'customCategories' | 'notes' | 'noteFolders'>) => void
  setActiveProject: (projectId: string | null) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
  
  // Chapter Actions
  createChapter: (projectId: string, chapter: Omit<Chapter, 'id' | 'versions' | 'wordCount'>) => void
  setActiveChapter: (chapterId: string | null) => void
  updateChapter: (projectId: string, chapterId: string, updates: Partial<Chapter>) => void
  deleteChapter: (projectId: string, chapterId: string) => void
  saveChapterVersion: (projectId: string, chapterId: string) => void
  restoreChapterVersion: (projectId: string, chapterId: string, versionId: string) => void
  
  // Character Actions
  createCharacter: (projectId: string, character: Omit<Character, 'id'>) => void
  updateCharacter: (projectId: string, characterId: string, updates: Partial<Character>) => void
  deleteCharacter: (projectId: string, characterId: string) => void
  
  // Location Actions
  createLocation: (projectId: string, location: Omit<Location, 'id'>) => void
  updateLocation: (projectId: string, locationId: string, updates: Partial<Location>) => void
  deleteLocation: (projectId: string, locationId: string) => void
  
  // Timeline Actions
  createTimelineEvent: (projectId: string, event: Omit<TimelineEvent, 'id'>) => void
  updateTimelineEvent: (projectId: string, eventId: string, updates: Partial<TimelineEvent>) => void
  deleteTimelineEvent: (projectId: string, eventId: string) => void
  
  // Note Actions
  createNote: (projectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (projectId: string, noteId: string, updates: Partial<Note>) => void
  deleteNote: (projectId: string, noteId: string) => void
  createNoteFolder: (projectId: string, folder: Omit<NoteFolder, 'id'>) => void
  deleteNoteFolder: (projectId: string, folderId: string) => void
  
  // Outline Actions
  setOutlineView: (view: 'kanban' | 'linear') => void
  setBeatSheetPreset: (preset: AppState['beatSheetPreset']) => void
  updateOutlineCard: (cardId: string, updates: Partial<OutlineCard>) => void
  reorderOutlineCards: (cards: OutlineCard[]) => void
  
  // Progress Actions
  addDailyWordCount: (count: number) => void
  updateWritingGoal: (goal: Partial<WritingGoal>) => void
  startSprint: (duration: number, goalWords: number) => void
  endSprint: (wordCountEnd: number) => void
  
  // AI Actions
  setActiveAgent: (agentId: string) => void
  addAIMessage: (agentId: string, message: Omit<AIMessage, 'id' | 'timestamp'>) => void
  clearAIMessages: (agentId: string) => void
  setAIContextMode: (mode: AIContextMode) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

// Demo Data
const demoProject: Project = {
  id: 'demo-project',
  title: 'The Last Chronicle',
  genre: 'Fantasy',
  targetWordCount: 80000,
  synopsis: 'In a world where magic is fading, a young scholar discovers an ancient chronicle that holds the key to restoring balance. But powerful forces will stop at nothing to keep the secrets buried.',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-03-20T14:30:00Z',
  chapters: [
    {
      id: 'ch-1',
      title: 'The Discovery',
      content: `<p>The dust motes danced in the shaft of golden light that pierced the archives' gloom. Elena traced her fingers along the leather spines, each one a whisper of forgotten knowledge.</p>

<p>"You shouldn't be down here," a voice echoed from the shadows.</p>

<p>She didn't turn. She knew that voice—had grown up with it, learned to ignore its warnings. "And yet here I am, Marcus."</p>

<p>Her brother emerged from between the towering shelves, his archivist robes rustling against the stone floor. "The Keeper will have your head if she catches you in the restricted section again."</p>

<p>"The Keeper can barely see past her own nose these days." Elena pulled a tome from the shelf, its binding cracked with age. "Besides, I found something. Something important."</p>

<p>Marcus moved closer, curiosity overcoming caution. "What is it?"</p>

<p>She opened the book to reveal pages that glowed with a faint, pulsing light. "The Last Chronicle. The one they said was destroyed in the Burning."</p>

<p>His face went pale. "That's impossible."</p>

<p>"And yet." She smiled, the thrill of discovery singing in her veins. "Here it is."</p>`,
      wordCount: 198,
      status: 'revised',
      povCharacter: 'char-1',
      summary: 'Elena discovers the legendary Last Chronicle in the forbidden archives, defying her brother\'s warnings.',
      notes: 'Need to establish the magic system more clearly. Show don\'t tell about the fading magic.',
      order: 1,
      versions: [
        {
          id: 'v1',
          content: '<p>First draft content...</p>',
          savedAt: '2024-01-20T10:00:00Z',
          wordCount: 150
        }
      ]
    },
    {
      id: 'ch-2',
      title: 'The Warning',
      content: `<p>The Chronicle's light had dimmed by the time Elena returned to her chambers, but its words still burned in her mind. Prophecies, she had always believed, were the refuge of the desperate—stories told to give meaning to chaos.</p>

<p>But this was different. This spoke of events she had witnessed with her own eyes.</p>

<p>The dying of the Everflame. The silence of the Oracle Pools. The withering of the Worldtree's leaves.</p>

<p>And it spoke of what was to come.</p>`,
      wordCount: 85,
      status: 'draft',
      povCharacter: 'char-1',
      summary: 'Elena reads the Chronicle and discovers disturbing prophecies that match recent events.',
      notes: 'Build tension. Foreshadow the antagonist.',
      order: 2,
      versions: []
    },
    {
      id: 'ch-3',
      title: 'Shadows Gather',
      content: '',
      wordCount: 0,
      status: 'draft',
      povCharacter: 'char-2',
      summary: 'Meanwhile, dark forces learn of the Chronicle\'s discovery.',
      notes: 'Introduce Lord Varen. Show his network of spies.',
      order: 3,
      versions: []
    }
  ],
  characters: [
    {
      id: 'char-1',
      name: 'Elena Brighthollow',
      role: 'protagonist',
      physicalDescription: 'Tall and slender with copper hair often escaping its braids. Sharp green eyes that miss nothing. A small scar on her left palm from a childhood accident.',
      personalityTraits: ['Curious', 'Stubborn', 'Compassionate', 'Reckless'],
      backstory: 'Raised in the Scholar\'s Quarter by her archivist father after her mother disappeared during an expedition. Has spent her life trying to uncover the truth about magic\'s decline.',
      relationships: [
        { characterId: 'char-2', relationship: 'Brother - often at odds but deeply loyal' },
        { characterId: 'char-3', relationship: 'Mentor - respects but questions' }
      ],
      arcNotes: 'Must learn to trust others and accept that some knowledge comes at too high a price.'
    },
    {
      id: 'char-2',
      name: 'Marcus Brighthollow',
      role: 'supporting',
      physicalDescription: 'Shorter than his sister, with the same copper hair but darker eyes. Carries himself with quiet authority. Always impeccably dressed in archivist robes.',
      personalityTraits: ['Cautious', 'Loyal', 'Intelligent', 'Conflicted'],
      backstory: 'Became an archivist to protect his sister, knowing her curiosity would lead her into danger. Secretly sympathizes with her quest but fears the consequences.',
      relationships: [
        { characterId: 'char-1', relationship: 'Sister - protective, sometimes suffocating' }
      ],
      arcNotes: 'Must choose between duty and family when the truth threatens everything he\'s sworn to protect.'
    },
    {
      id: 'char-3',
      name: 'Lord Varen',
      role: 'antagonist',
      physicalDescription: 'Ageless face with silver-white hair and eyes like polished obsidian. Moves with unnatural grace. Wears robes that seem to absorb light.',
      personalityTraits: ['Patient', 'Ruthless', 'Charismatic', 'Secretive'],
      backstory: 'One of the last of the Old Mages, he has lived for centuries by draining magic from the world itself. The Chronicle reveals the truth about what he has done.',
      relationships: [],
      arcNotes: 'Believes he is saving the world by controlling magic\'s decline. A villain who sees himself as the hero.'
    }
  ],
  locations: [
    {
      id: 'loc-1',
      name: 'The Grand Archives',
      description: 'A vast underground library beneath the capital city, containing knowledge from before the Age of Silence. Miles of shelving carved into living rock, lit by ever-dimming mage-lights.',
      associatedCharacters: ['char-1', 'char-2'],
      scenesSetHere: ['ch-1']
    },
    {
      id: 'loc-2',
      name: 'The Worldtree\'s Shadow',
      description: 'Once a sacred grove where the Worldtree\'s branches touched the sky. Now a place of dying magic, where leaves fall like tears and the ground is thick with decay.',
      associatedCharacters: ['char-3'],
      scenesSetHere: []
    }
  ],
  timeline: [
    {
      id: 'event-1',
      title: 'The Burning',
      description: 'The destruction of magical texts ordered by the Council of Shadows. The Last Chronicle was thought to be lost.',
      date: '500 years ago',
      characterIds: [],
      type: 'world'
    },
    {
      id: 'event-2',
      title: 'Elena discovers the Chronicle',
      description: 'In the restricted archives, Elena finds what should not exist.',
      date: 'Present day',
      chapterId: 'ch-1',
      characterIds: ['char-1', 'char-2'],
      type: 'plot'
    }
  ],
  customCategories: [
    {
      id: 'cat-1',
      name: 'Magic Systems',
      items: [
        {
          id: 'item-1',
          name: 'Chronicle Magic',
          description: 'Ancient form of magic tied to written words. The act of writing something in the Chronicle can make it true—but at a cost.',
          linkedCharacters: ['char-1'],
          linkedLocations: []
        },
        {
          id: 'item-2',
          name: 'Worldtree Magic',
          description: 'The natural magic of the world, flowing from the Worldtree. Has been fading for centuries.',
          linkedCharacters: ['char-3'],
          linkedLocations: ['loc-2']
        }
      ]
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Magic System Rules',
      content: '1. Magic requires sacrifice\n2. Writing in the Chronicle makes things true\n3. The Worldtree is the source of natural magic\n4. Mages can extend life by draining magic',
      folderId: 'folder-1',
      tags: ['worldbuilding', 'magic'],
      linkedChapters: [],
      linkedCharacters: [],
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-02-10T15:30:00Z'
    }
  ],
  noteFolders: [
    { id: 'folder-1', name: 'Worldbuilding' },
    { id: 'folder-2', name: 'Character Notes' },
    { id: 'folder-3', name: 'Research' }
  ]
}

const demoProject2: Project = {
  id: 'demo-project-2',
  title: 'Midnight in Manhattan',
  genre: 'Mystery/Thriller',
  targetWordCount: 65000,
  synopsis: 'A detective haunted by an unsolved case gets a second chance when new evidence emerges—but someone is watching, and they\'ll kill to keep the truth buried.',
  createdAt: '2024-02-01T10:00:00Z',
  updatedAt: '2024-03-18T09:15:00Z',
  chapters: [
    {
      id: 'mm-ch-1',
      title: 'Cold Coffee',
      content: '<p>The coffee had gone cold three hours ago. Detective Sarah Chen didn\'t notice.</p>',
      wordCount: 12,
      status: 'draft',
      summary: 'Sarah receives a mysterious envelope containing evidence from her cold case.',
      notes: 'Set the noir tone. Rain, city lights, lonely detective.',
      order: 1,
      versions: []
    }
  ],
  characters: [],
  locations: [],
  timeline: [],
  customCategories: [],
  notes: [],
  noteFolders: [{ id: 'mm-folder-1', name: 'Clues & Evidence' }]
}

// AI Agents
export const AI_AGENTS: AIAgent[] = [
  {
    id: 'brainstorm',
    name: 'Brainstorm Partner',
    description: 'Generates "what if" scenarios, plot twists, and character ideas',
    icon: 'Lightbulb',
    systemPrompt: 'You are a creative brainstorming partner for fiction writers. Generate unexpected plot twists, character ideas, and "what if" scenarios. Be bold and creative.'
  },
  {
    id: 'dev-editor',
    name: 'Developmental Editor',
    description: 'Analyzes structure, pacing, and character arcs',
    icon: 'FileSearch',
    systemPrompt: 'You are a developmental editor. Analyze story structure, pacing, character arcs, and give big-picture feedback. Be constructive but honest.'
  },
  {
    id: 'line-editor',
    name: 'Line Editor',
    description: 'Suggests prose improvements and catches repetition',
    icon: 'Pencil',
    systemPrompt: 'You are a line editor. Suggest prose improvements, catch repetition, tighten sentences, and improve flow. Focus on the craft of writing.'
  },
  {
    id: 'continuity',
    name: 'Continuity Checker',
    description: 'Cross-references story bible to flag inconsistencies',
    icon: 'GitCompare',
    systemPrompt: 'You are a continuity checker. Cross-reference details to flag inconsistencies in character descriptions, timeline, and world details.'
  },
  {
    id: 'dialogue',
    name: 'Dialogue Coach',
    description: 'Rewrites dialogue for voice and subtext',
    icon: 'MessageSquare',
    systemPrompt: 'You are a dialogue coach. Help improve dialogue for voice, subtext, and character-specific speech patterns. Make conversations feel natural and purposeful.'
  },
  {
    id: 'research',
    name: 'Research Assistant',
    description: 'Answers questions and suggests period-accurate details',
    icon: 'BookOpen',
    systemPrompt: 'You are a research assistant. Answer factual questions, suggest historically or culturally accurate details, and help with world-building research.'
  },
  {
    id: 'prompts',
    name: 'Writing Prompts',
    description: 'Generates scene starters to break blocks',
    icon: 'Sparkles',
    systemPrompt: 'You are a writing prompt generator. Create scene starters, exercises, and creative challenges to help writers break through blocks.'
  }
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial UI State
      leftSidebarOpen: true,
      rightSidebarOpen: false,
      activeView: 'dashboard',
      activeSubView: 'characters',
      fullscreenMode: false,
      splitViewOpen: false,
      
      // Initial Data
      projects: [demoProject, demoProject2],
      activeProjectId: null,
      activeChapterId: null,
      
      // Outline
      outlineCards: [],
      outlineView: 'kanban',
      beatSheetPreset: 'none',
      
      // Progress
      dailyWordCounts: [
        { date: '2024-03-15', count: 1250 },
        { date: '2024-03-16', count: 890 },
        { date: '2024-03-17', count: 1500 },
        { date: '2024-03-18', count: 0 },
        { date: '2024-03-19', count: 2100 },
        { date: '2024-03-20', count: 750 },
      ],
      writingGoal: {
        dailyTarget: 1000,
        deadline: '2024-12-31',
        streakDays: 5,
        lastWritingDate: '2024-03-20'
      },
      sprintSessions: [],
      activeSprintId: null,
      
      // AI
      activeAgentId: 'brainstorm',
      aiMessages: {},
      aiContextMode: 'chapter',
      
      // UI Actions
      setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
      setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view }),
      setActiveSubView: (subView) => set({ activeSubView: subView }),
      setFullscreenMode: (fullscreen) => set({ fullscreenMode: fullscreen }),
      setSplitViewOpen: (open) => set({ splitViewOpen: open }),
      
      // Project Actions
      createProject: (projectData) => set((state) => ({
        projects: [...state.projects, {
          ...projectData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          chapters: [],
          characters: [],
          locations: [],
          timeline: [],
          customCategories: [],
          notes: [],
          noteFolders: [
            { id: generateId(), name: 'General' }
          ]
        }]
      })),
      
      setActiveProject: (projectId) => set({ 
        activeProjectId: projectId,
        activeChapterId: null
      }),
      
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        )
      })),
      
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId
      })),
      
      // Chapter Actions
      createChapter: (projectId, chapterData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          const newChapter: Chapter = {
            ...chapterData,
            id: generateId(),
            wordCount: 0,
            versions: []
          }
          return {
            ...p,
            chapters: [...p.chapters, newChapter],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      setActiveChapter: (chapterId) => set({ activeChapterId: chapterId }),
      
      updateChapter: (projectId, chapterId, updates) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.map(ch => {
              if (ch.id !== chapterId) return ch
              const newContent = updates.content ?? ch.content
              const wordCount = newContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
              return { ...ch, ...updates, wordCount }
            }),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteChapter: (projectId, chapterId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.filter(ch => ch.id !== chapterId),
            updatedAt: new Date().toISOString()
          }
        }),
        activeChapterId: state.activeChapterId === chapterId ? null : state.activeChapterId
      })),
      
      saveChapterVersion: (projectId, chapterId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.map(ch => {
              if (ch.id !== chapterId) return ch
              return {
                ...ch,
                versions: [...ch.versions, {
                  id: generateId(),
                  content: ch.content,
                  savedAt: new Date().toISOString(),
                  wordCount: ch.wordCount
                }]
              }
            })
          }
        })
      })),
      
      restoreChapterVersion: (projectId, chapterId, versionId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            chapters: p.chapters.map(ch => {
              if (ch.id !== chapterId) return ch
              const version = ch.versions.find(v => v.id === versionId)
              if (!version) return ch
              return {
                ...ch,
                content: version.content,
                wordCount: version.wordCount
              }
            }),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      // Character Actions
      createCharacter: (projectId, characterData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            characters: [...p.characters, { ...characterData, id: generateId() }],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      updateCharacter: (projectId, characterId, updates) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            characters: p.characters.map(c => c.id === characterId ? { ...c, ...updates } : c),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteCharacter: (projectId, characterId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            characters: p.characters.filter(c => c.id !== characterId),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      // Location Actions
      createLocation: (projectId, locationData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            locations: [...p.locations, { ...locationData, id: generateId() }],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      updateLocation: (projectId, locationId, updates) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            locations: p.locations.map(l => l.id === locationId ? { ...l, ...updates } : l),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteLocation: (projectId, locationId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            locations: p.locations.filter(l => l.id !== locationId),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      // Timeline Actions
      createTimelineEvent: (projectId, eventData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            timeline: [...p.timeline, { ...eventData, id: generateId() }],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      updateTimelineEvent: (projectId, eventId, updates) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            timeline: p.timeline.map(e => e.id === eventId ? { ...e, ...updates } : e),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteTimelineEvent: (projectId, eventId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            timeline: p.timeline.filter(e => e.id !== eventId),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      // Note Actions
      createNote: (projectId, noteData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            notes: [...p.notes, {
              ...noteData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      updateNote: (projectId, noteId, updates) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            notes: p.notes.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteNote: (projectId, noteId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            notes: p.notes.filter(n => n.id !== noteId),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      createNoteFolder: (projectId, folderData) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            noteFolders: [...p.noteFolders, { ...folderData, id: generateId() }],
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      deleteNoteFolder: (projectId, folderId) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p
          return {
            ...p,
            noteFolders: p.noteFolders.filter(f => f.id !== folderId),
            notes: p.notes.filter(n => n.folderId !== folderId),
            updatedAt: new Date().toISOString()
          }
        })
      })),
      
      // Outline Actions
      setOutlineView: (view) => set({ outlineView: view }),
      setBeatSheetPreset: (preset) => set({ beatSheetPreset: preset }),
      updateOutlineCard: (cardId, updates) => set((state) => ({
        outlineCards: state.outlineCards.map(c => c.id === cardId ? { ...c, ...updates } : c)
      })),
      reorderOutlineCards: (cards) => set({ outlineCards: cards }),
      
      // Progress Actions
      addDailyWordCount: (count) => set((state) => {
        const today = new Date().toISOString().split('T')[0]
        const existing = state.dailyWordCounts.find(d => d.date === today)
        if (existing) {
          return {
            dailyWordCounts: state.dailyWordCounts.map(d => 
              d.date === today ? { ...d, count: d.count + count } : d
            )
          }
        }
        return {
          dailyWordCounts: [...state.dailyWordCounts, { date: today, count }]
        }
      }),
      
      updateWritingGoal: (goal) => set((state) => ({
        writingGoal: { ...state.writingGoal, ...goal }
      })),
      
      startSprint: (duration, goalWords) => {
        const project = get().projects.find(p => p.id === get().activeProjectId)
        const chapter = project?.chapters.find(c => c.id === get().activeChapterId)
        const sprintId = generateId()
        set({
          activeSprintId: sprintId,
          sprintSessions: [...get().sprintSessions, {
            id: sprintId,
            startTime: new Date().toISOString(),
            duration,
            wordCountStart: chapter?.wordCount ?? 0,
            wordCountEnd: 0,
            goalWords
          }]
        })
      },
      
      endSprint: (wordCountEnd) => set((state) => ({
        activeSprintId: null,
        sprintSessions: state.sprintSessions.map(s => 
          s.id === state.activeSprintId ? { ...s, wordCountEnd } : s
        )
      })),
      
      // AI Actions
      setActiveAgent: (agentId) => set({ activeAgentId: agentId }),
      addAIMessage: (agentId, message) => set((state) => ({
        aiMessages: {
          ...state.aiMessages,
          [agentId]: [
            ...(state.aiMessages[agentId] ?? []),
            { ...message, id: generateId(), timestamp: new Date().toISOString() }
          ]
        }
      })),
      clearAIMessages: (agentId) => set((state) => ({
        aiMessages: { ...state.aiMessages, [agentId]: [] }
      })),
      setAIContextMode: (mode) => set({ aiContextMode: mode })
    }),
    {
      name: 'novel-studio-storage',
      partialize: (state) => ({
        projects: state.projects,
        dailyWordCounts: state.dailyWordCounts,
        writingGoal: state.writingGoal,
        sprintSessions: state.sprintSessions
      })
    }
  )
)
