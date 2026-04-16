"use client"

import { cn } from "@/lib/utils"
import { useAppStore, AI_AGENTS } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Lightbulb,
  FileSearch,
  Pencil,
  GitCompare,
  MessageSquare,
  BookOpen,
  Sparkles,
  Bot
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  FileSearch,
  Pencil,
  GitCompare,
  MessageSquare,
  BookOpen,
  Sparkles,
}

export function RightSidebar() {
  const {
    rightSidebarOpen,
    setRightSidebarOpen,
    activeAgentId,
    setActiveAgent,
    aiMessages,
    addAIMessage,
    clearAIMessages,
    aiContextMode,
    setAIContextMode,
    activeProjectId,
    activeChapterId
  } = useAppStore()

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeAgent = AI_AGENTS.find(a => a.id === activeAgentId)
  const messages = aiMessages[activeAgentId] ?? []
  const AgentIcon = activeAgent ? iconMap[activeAgent.icon] || Bot : Bot

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    addAIMessage(activeAgentId, { role: 'user', content: input })
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        brainstorm: [
          "What if the Chronicle itself is sentient and has been manipulating events to be found?",
          "Consider having Marcus discover his own secret connection to the magic system.",
          "Try introducing a third faction that wants the Chronicle for entirely different reasons.",
        ],
        'dev-editor': [
          "Your opening chapter establishes intrigue well, but consider deepening Elena's emotional stakes earlier.",
          "The pacing in Chapter 2 feels rushed. Let the reader sit with the prophecy's implications longer.",
          "Marcus's conflict between duty and family could use more foreshadowing in the first chapter.",
        ],
        'line-editor': [
          "\"Dust motes danced\" is evocative but consider varying your sentence openings for rhythm.",
          "You've used \"shadows\" three times in this passage. Try alternatives like \"gloom\" or \"darkness.\"",
          "The dialogue tag \"echoed from the shadows\" tells us about the space. Consider showing it instead.",
        ],
        continuity: [
          "Note: Elena's eye color is mentioned as green in Chapter 1 but referenced as \"bright\" without color in Chapter 2.",
          "Timeline check: The Burning happened 500 years ago, but Chapter 2 references \"centuries\" which is vague.",
          "Character relationship: Marcus is called her brother but their shared history needs more grounding.",
        ],
        dialogue: [
          "Try adding subtext: Instead of \"That's impossible,\" have Marcus's body language betray his words.",
          "Elena's response could be sharper, more characteristic of her reckless nature.",
          "Consider giving Marcus a verbal tic or phrase that marks his cautious personality.",
        ],
        research: [
          "For archive authenticity, medieval scriptoriums used iron gall ink, which turns brown over time.",
          "Forbidden library tropes trace back to Alexandria. Consider what makes yours unique.",
          "Magical books in folklore often require blood, breath, or sacrifice to open.",
        ],
        prompts: [
          "Write a scene where Elena must choose between saving Marcus or protecting the Chronicle.",
          "Describe the world through Lord Varen's eyes. What beauty does he see in control?",
          "Write the moment Elena's mother disappeared, from young Marcus's perspective.",
        ],
      }

      const agentResponses = responses[activeAgentId] || responses.brainstorm
      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)]
      
      addAIMessage(activeAgentId, { role: 'assistant', content: randomResponse })
      setIsLoading(false)
    }, 1500)
  }

  if (!rightSidebarOpen) {
    return (
      <aside className="w-12 border-l border-border bg-sidebar flex flex-col items-center py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent mb-2"
          onClick={() => setRightSidebarOpen(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-2 items-center">
          <Bot className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180">AI Assistant</span>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-80 border-l border-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between h-14 border-b border-sidebar-border px-3">
        <div className="flex items-center gap-2">
          <AgentIcon className="h-5 w-5 text-primary" />
          <span className="font-medium text-sidebar-foreground">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setRightSidebarOpen(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Agent Selector */}
      <div className="p-3 border-b border-sidebar-border space-y-3">
        <Select value={activeAgentId} onValueChange={setActiveAgent}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_AGENTS.map((agent) => {
              const Icon = iconMap[agent.icon] || Bot
              return (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">{activeAgent?.description}</p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Context:</span>
          <Select value={aiContextMode} onValueChange={(v) => setAIContextMode(v as typeof aiContextMode)}>
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chapter">Current Chapter</SelectItem>
              <SelectItem value="manuscript">Full Manuscript</SelectItem>
              <SelectItem value="storyBible">Story Bible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!activeProjectId && (
          <Badge variant="outline\" className="text-xs">
            Select a project to enable AI assistance
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <AgentIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Ask {activeAgent?.name} for help with your writing.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3 text-sm",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground ml-4"
                    : "bg-muted mr-4"
                )}
              >
                {message.content}
              </div>
            ))
          )}
          {isLoading && (
            <div className="bg-muted rounded-lg p-3 text-sm mr-4">
              <div className="flex items-center gap-2">
                <div className="animate-pulse-soft flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animation-delay-200"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animation-delay-400"></span>
                </div>
                <span className="text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-sidebar-border">
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mb-2 text-muted-foreground hover:text-destructive"
            onClick={() => clearAIMessages(activeAgentId)}
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Clear conversation
          </Button>
        )}
        <div className="flex gap-2">
          <Textarea
            placeholder={`Ask ${activeAgent?.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={!activeProjectId}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !activeProjectId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
