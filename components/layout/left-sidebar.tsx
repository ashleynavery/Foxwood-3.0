"use client"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  ListTree,
  Search,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Settings,
  HelpCircle
} from "lucide-react"

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'editor', label: 'Manuscript', icon: FileText },
  { id: 'storyBible', label: 'Story Bible', icon: BookOpen },
  { id: 'outline', label: 'Outline', icon: ListTree },
  { id: 'research', label: 'Research & Notes', icon: Search },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function LeftSidebar() {
  const { 
    leftSidebarOpen, 
    setLeftSidebarOpen, 
    activeView, 
    setActiveView,
    activeProjectId
  } = useAppStore()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
          leftSidebarOpen ? "w-56" : "w-16"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-14 border-b border-sidebar-border px-3",
          leftSidebarOpen ? "justify-between" : "justify-center"
        )}>
          {leftSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                  <PenTool className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sidebar-foreground">Novel Studio</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => setLeftSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              const isDisabled = item.id !== 'dashboard' && !activeProjectId

              if (leftSidebarOpen) {
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start h-10 text-sidebar-foreground",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isDisabled && setActiveView(item.id)}
                    disabled={isDisabled}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )
              }

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-10 w-10 text-sidebar-foreground",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isDisabled && setActiveView(item.id)}
                      disabled={isDisabled}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t border-sidebar-border p-2">
          {leftSidebarOpen ? (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start h-10 text-sidebar-foreground">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="justify-start h-10 text-sidebar-foreground">
                <HelpCircle className="h-4 w-4 mr-3" />
                Help
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-sidebar-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-sidebar-foreground">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Help</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
