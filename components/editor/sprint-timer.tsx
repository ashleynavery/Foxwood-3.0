"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Play, Pause, RotateCcw, Trophy } from "lucide-react"

interface SprintTimerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SprintTimer({ open, onOpenChange }: SprintTimerProps) {
  const { 
    activeSprintId, 
    sprintSessions, 
    startSprint, 
    endSprint,
    projects,
    activeProjectId,
    activeChapterId
  } = useAppStore()

  const [duration, setDuration] = useState(15)
  const [goalWords, setGoalWords] = useState(500)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const activeSprint = sprintSessions.find(s => s.id === activeSprintId)
  const activeProject = projects.find(p => p.id === activeProjectId)
  const activeChapter = activeProject?.chapters.find(c => c.id === activeChapterId)
  const currentWords = activeChapter?.wordCount ?? 0
  const wordsWritten = activeSprint ? currentWords - activeSprint.wordCountStart : 0

  useEffect(() => {
    if (!activeSprint || isPaused) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true)
          endSprint(currentWords)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSprint, isPaused, currentWords, endSprint])

  useEffect(() => {
    if (activeSprint) {
      const elapsed = Math.floor((Date.now() - new Date(activeSprint.startTime).getTime()) / 1000)
      const remaining = activeSprint.duration * 60 - elapsed
      setTimeLeft(Math.max(0, remaining))
    }
  }, [activeSprint])

  const handleStart = () => {
    startSprint(duration, goalWords)
    setTimeLeft(duration * 60)
    setIsComplete(false)
    setIsPaused(false)
  }

  const handleEnd = () => {
    endSprint(currentWords)
    setIsComplete(true)
  }

  const handleReset = () => {
    setIsComplete(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = activeSprint 
    ? Math.min(100, (wordsWritten / activeSprint.goalWords) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Writing Sprint</DialogTitle>
          <DialogDescription>
            Challenge yourself with a timed writing session.
          </DialogDescription>
        </DialogHeader>

        {!activeSprint && !isComplete ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                min={1}
                max={120}
              />
            </div>
            <div className="space-y-2">
              <Label>Word Goal</Label>
              <Input
                type="number"
                value={goalWords}
                onChange={(e) => setGoalWords(parseInt(e.target.value) || 500)}
                min={50}
              />
              <p className="text-xs text-muted-foreground">
                That&apos;s about {Math.round(goalWords / duration)} words per minute
              </p>
            </div>
          </div>
        ) : isComplete ? (
          <div className="py-8 text-center">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Sprint Complete!</h3>
            <p className="text-muted-foreground mb-4">
              You wrote <span className="font-bold text-foreground">{wordsWritten.toLocaleString()}</span> words
              {activeSprint && (
                <span>
                  {" "}out of {activeSprint.goalWords.toLocaleString()} goal
                </span>
              )}
            </p>
            {activeSprint && wordsWritten >= activeSprint.goalWords && (
              <p className="text-green-500 font-medium">Goal achieved!</p>
            )}
          </div>
        ) : (
          <div className="py-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-mono font-bold mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-muted-foreground">
                {wordsWritten.toLocaleString()} / {activeSprint?.goalWords.toLocaleString()} words
              </p>
            </div>

            <Progress value={progress} className="h-3 mb-4" />

            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleEnd}
              >
                End Sprint
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {!activeSprint && !isComplete ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleStart}>
                <Play className="h-4 w-4 mr-2" />
                Start Sprint
              </Button>
            </>
          ) : isComplete ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                New Sprint
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
