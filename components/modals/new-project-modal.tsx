"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Literary Fiction",
  "Historical Fiction",
  "Young Adult",
  "Middle Grade",
  "Memoir",
  "Other",
];

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const { createProject } = useAppStore();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [targetWordCount, setTargetWordCount] = useState("80000");
  const [synopsis, setSynopsis] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;

    createProject({
      title: title.trim(),
      genre: genre || "Other",
      targetWordCount: parseInt(targetWordCount) || 80000,
      synopsis: synopsis.trim(),
    });

    // Reset form
    setTitle("");
    setGenre("");
    setTargetWordCount("80000");
    setSynopsis("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new writing project. You can always edit these details later.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Project Title</FieldLabel>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your novel's title"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="genre">Genre</FieldLabel>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="wordCount">Target Word Count</FieldLabel>
            <Input
              id="wordCount"
              type="number"
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(e.target.value)}
              placeholder="80000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average novel: 70,000-100,000 words
            </p>
          </Field>

          <Field>
            <FieldLabel htmlFor="synopsis">Synopsis (Optional)</FieldLabel>
            <Textarea
              id="synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="A brief description of your story..."
              rows={4}
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
