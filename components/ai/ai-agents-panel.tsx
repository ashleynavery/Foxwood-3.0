"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sparkles,
  BookOpen,
  Pencil,
  Search,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Send,
  Copy,
  RotateCcw,
  FileText,
  Book,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AgentType =
  | "brainstorm"
  | "developmental"
  | "line"
  | "continuity"
  | "dialogue"
  | "research"
  | "prompt";

type ContextScope = "chapter" | "manuscript" | "bible";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasSuggestion?: boolean;
}

const agents: {
  id: AgentType;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}[] = [
  {
    id: "brainstorm",
    name: "Brainstorm Partner",
    icon: <Lightbulb className="h-4 w-4" />,
    description: "Generate plot twists, character ideas, and 'what if' scenarios",
    color: "bg-amber-500/20 text-amber-500",
  },
  {
    id: "developmental",
    name: "Developmental Editor",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Analyze structure, pacing, and character arcs",
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    id: "line",
    name: "Line Editor",
    icon: <Pencil className="h-4 w-4" />,
    description: "Improve prose, catch repetition, tighten sentences",
    color: "bg-emerald-500/20 text-emerald-500",
  },
  {
    id: "continuity",
    name: "Continuity Checker",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "Flag inconsistencies in your story bible",
    color: "bg-red-500/20 text-red-500",
  },
  {
    id: "dialogue",
    name: "Dialogue Coach",
    icon: <MessageSquare className="h-4 w-4" />,
    description: "Improve dialogue voice, subtext, and character speech",
    color: "bg-purple-500/20 text-purple-500",
  },
  {
    id: "research",
    name: "Research Assistant",
    icon: <Search className="h-4 w-4" />,
    description: "Answer questions and suggest period-accurate details",
    color: "bg-cyan-500/20 text-cyan-500",
  },
  {
    id: "prompt",
    name: "Writing Prompts",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Generate scene starters to break writer's block",
    color: "bg-pink-500/20 text-pink-500",
  },
];

const contextScopes: { id: ContextScope; name: string; icon: React.ReactNode }[] = [
  { id: "chapter", name: "Current Chapter", icon: <FileText className="h-3 w-3" /> },
  { id: "manuscript", name: "Full Manuscript", icon: <Book className="h-3 w-3" /> },
  { id: "bible", name: "Story Bible", icon: <Database className="h-3 w-3" /> },
];

// Demo responses for each agent type
const demoResponses: Record<AgentType, string[]> = {
  brainstorm: [
    "What if your protagonist discovers that their mentor has been manipulating events from the very beginning? This could add a layer of betrayal that raises the emotional stakes significantly.",
    "Consider introducing a ticking clock element - perhaps there's a celestial event that only occurs once every century, and your characters must complete their quest before it passes.",
    "Here's a twist: what if the 'villain' is actually trying to prevent a greater catastrophe that only they know about? Their methods are wrong, but their motivation is sympathetic.",
  ],
  developmental: [
    "**Pacing Analysis:** Your second act feels slightly rushed. The protagonist's transformation from reluctant hero to committed leader happens in just two chapters. Consider adding a scene showing their internal struggle.\n\n**Suggestion:** Insert a quiet moment where they question their abilities, perhaps a conversation with a trusted friend.",
    "**Character Arc:** Elena's motivation becomes unclear around Chapter 7. Earlier, she's driven by revenge, but suddenly she's focused on protection. Bridge this transition with a pivotal scene.",
    "**Structure Note:** Your inciting incident occurs quite late (Chapter 3). Modern readers expect to be hooked within the first few pages. Consider starting closer to the action.",
  ],
  line: [
    "**Original:** \"She walked slowly across the room, her feet making soft sounds on the wooden floor.\"\n\n**Revised:** \"Her footsteps whispered across the hardwood.\"\n\nThis tightens the sentence while maintaining the quiet atmosphere you're creating.",
    "I noticed the word 'suddenly' appears 23 times in this chapter. Consider varying your transitions:\n- \"In an instant...\"\n- \"Without warning...\"\n- Or simply remove it and let the action speak for itself.",
    "**Passive voice detected:** \"The door was opened by Marcus\" → \"Marcus opened the door\"\n\nActive voice creates more immediate, engaging prose.",
  ],
  continuity: [
    "**Timeline Inconsistency Found:**\n- Chapter 3: Elena mentions the war ended \"five years ago\"\n- Chapter 8: She refers to it as \"nearly a decade past\"\n\nRecommendation: Standardize to one timeframe throughout.",
    "**Character Description Mismatch:**\n- Story Bible: Marcus has \"steel-gray eyes\"\n- Chapter 12: His eyes are described as \"deep brown\"\n\nWould you like me to update the Story Bible or flag this for revision?",
    "**Location Error:**\nThe tavern \"The Rusty Anchor\" is placed in the port district in Chapter 2, but characters walk there from the market square \"in minutes\" in Chapter 9, despite these areas being described as \"across the city\" earlier.",
  ],
  dialogue: [
    "**Original:** \"I don't think we should do this,\" said Marcus. \"It's too dangerous.\"\n\n**With more subtext:** \"You know what happened last time.\" Marcus wouldn't meet her eyes. \"I can't—I won't watch that again.\"\n\nThis version shows his fear through behavior rather than stating it directly.",
    "**Character Voice Note:** Your antagonist sounds too similar to your protagonist. Consider giving them:\n- Shorter, clipped sentences (shows impatience/authority)\n- Formal vocabulary (suggests education/superiority)\n- A verbal tic or catchphrase (\"You see...\" or \"Naturally...\")",
    "**Dialogue Tag Variety:**\nYou've used 'said' 15 times on this page. While 'said' is often invisible to readers, consider:\n- Action beats: She slammed her cup down. \"Enough.\"\n- Removing tags when speakers are clear\n- Occasional alternatives: whispered, muttered, called",
  ],
  research: [
    "**Victorian Era Dining Customs:**\nFor your 1880s London setting, remember:\n- Dinner was served between 7-9 PM for upper classes\n- Formal dinners had 8-12 courses\n- Ladies withdrew after dessert while gentlemen smoked\n- Calling cards were essential for social visits\n\nWould you like details on specific aspects?",
    "**Medieval Sword Combat:**\nThe longsword fighting style you're describing would historically involve:\n- Half-swording (gripping the blade) for better control\n- Murder strokes using the pommel as a weapon\n- Actual fights lasted seconds, not minutes\n\nShall I provide more period-accurate combat descriptions?",
    "**Botanical Accuracy:**\nThe flower you mentioned (blue roses) doesn't exist naturally. Options:\n- Use 'deep purple roses' (historically accurate)\n- Acknowledge they're artificially dyed (post-1840s)\n- Make it a magical/fantastical element in your world",
  ],
  prompt: [
    "**Scene Starter:**\n\n*The letter had been slipped under her door sometime during the night. Three words in her mother's handwriting—her mother who had been dead for seven years.*\n\n---\nUse this to explore: secrets, supernatural elements, or family mysteries.",
    "**Dialogue Exercise:**\n\nWrite a conversation where two characters discuss the weather, but both are actually talking about their failing relationship. Neither acknowledges the subtext directly.\n\n---\nThis practices: subtext, tension, and character voice.",
    "**Opening Hook:**\n\n*Everyone remembers where they were when the sky turned silver. I remember where I was supposed to be, which wasn't breaking into the museum's restricted archive.*\n\n---\nElements to explore: mystery, personal stakes, larger world events.",
  ],
};

export function AIAgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("brainstorm");
  const [contextScope, setContextScope] = useState<ContextScope>("chapter");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentAgent = agents.find((a) => a.id === selectedAgent)!;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = demoResponses[selectedAgent];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        hasSuggestion: selectedAgent === "line" || selectedAgent === "dialogue",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Agent Selector */}
      <div className="border-b border-border p-3">
        <Select
          value={selectedAgent}
          onValueChange={(v) => setSelectedAgent(v as AgentType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-md p-1", agent.color)}>
                    {agent.icon}
                  </span>
                  <span>{agent.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="mt-2 text-xs text-muted-foreground">
          {currentAgent.description}
        </p>

        {/* Context Scope */}
        <div className="mt-3 flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Context:</span>
          <div className="flex gap-1">
            {contextScopes.map((scope) => (
              <TooltipProvider key={scope.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={contextScope === scope.id ? "secondary" : "ghost"}
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => setContextScope(scope.id)}
                    >
                      {scope.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{scope.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className={cn("mb-3 rounded-xl p-4", currentAgent.color)}>
              {currentAgent.icon}
            </div>
            <h3 className="font-medium">{currentAgent.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentAgent.description}
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Try asking:</p>
              {selectedAgent === "brainstorm" && (
                <>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    What if my protagonist has a secret twin?
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    Generate a plot twist for chapter 5
                  </Badge>
                </>
              )}
              {selectedAgent === "developmental" && (
                <>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    Analyze my story&apos;s pacing
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    Review my protagonist&apos;s arc
                  </Badge>
                </>
              )}
              {selectedAgent === "line" && (
                <>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    Tighten this paragraph
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    Find repetitive words
                  </Badge>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3",
                  message.role === "user"
                    ? "ml-4 bg-primary text-primary-foreground"
                    : "mr-4 bg-muted"
                )}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                {message.role === "assistant" && (
                  <div className="mt-2 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                    {message.hasSuggestion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-primary"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Apply to Editor
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="mr-4 rounded-lg bg-muted p-3">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${currentAgent.name}...`}
            className="min-h-[60px] resize-none"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Clear
          </Button>
          <Button size="sm" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="mr-1 h-3 w-3" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
