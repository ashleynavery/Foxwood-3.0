"use client";

import { useState } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MainHeader } from "@/components/layout/main-header";
import { Dashboard } from "@/components/views/dashboard";
import { ManuscriptEditor } from "@/components/views/manuscript-editor";
import { StoryBible } from "@/components/views/story-bible";
import { OutlineView } from "@/components/views/outline-view";
import { ResearchView } from "@/components/views/research-view";
import { AnalyticsView } from "@/components/views/analytics-view";
import { NewProjectModal } from "@/components/modals/new-project-modal";
import { ExportModal } from "@/components/modals/export-modal";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function NovelStudio() {
  const {
    activeView,
    leftSidebarOpen,
    rightSidebarOpen,
  } = useAppStore();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportType, setExportType] = useState<"manuscript" | "bible">("manuscript");

  const handleExport = (type: "manuscript" | "bible") => {
    setExportType(type);
    setExportOpen(true);
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNewProject={() => setNewProjectOpen(true)} />;
      case "editor":
        return <ManuscriptEditor />;
      case "storyBible":
        return <StoryBible />;
      case "outline":
        return <OutlineView />;
      case "research":
        return <ResearchView />;
      case "analytics":
        return <AnalyticsView />;
      default:
        return <Dashboard onNewProject={() => setNewProjectOpen(true)} />;
    }
  };

  return (
    <div className="relative flex h-screen bg-background">
      {/* Foxwood Forest Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 dark:opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/foxwood-forest.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background pointer-events-none" />
      
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          leftSidebarOpen ? "ml-64" : "ml-16",
          rightSidebarOpen ? "mr-80" : "mr-0"
        )}
      >
        <MainHeader onExport={handleExport} />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Modals */}
      <NewProjectModal open={newProjectOpen} onOpenChange={setNewProjectOpen} />
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        exportType={exportType}
      />
    </div>
  );
}
