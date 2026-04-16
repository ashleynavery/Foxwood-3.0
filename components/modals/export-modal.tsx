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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  FileType,
  BookOpen,
  Code,
  Download,
  CheckCircle,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportType: "manuscript" | "bible";
}

const manuscriptFormats = [
  {
    id: "docx",
    name: "Microsoft Word",
    extension: ".docx",
    icon: <FileText className="h-5 w-5" />,
    description: "Best for editing and sharing with others",
  },
  {
    id: "pdf",
    name: "PDF Document",
    extension: ".pdf",
    icon: <FileType className="h-5 w-5" />,
    description: "Best for printing and final distribution",
  },
  {
    id: "epub",
    name: "EPUB eBook",
    extension: ".epub",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Best for e-readers and digital publishing",
  },
  {
    id: "md",
    name: "Markdown",
    extension: ".md",
    icon: <Code className="h-5 w-5" />,
    description: "Best for version control and plain text",
  },
];

const bibleFormats = [
  {
    id: "pdf",
    name: "PDF Document",
    extension: ".pdf",
    icon: <FileType className="h-5 w-5" />,
    description: "Formatted document with images",
  },
  {
    id: "json",
    name: "JSON Data",
    extension: ".json",
    icon: <Database className="h-5 w-5" />,
    description: "Structured data for backup or import",
  },
];

export function ExportModal({ open, onOpenChange, exportType }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState(
    exportType === "manuscript" ? "docx" : "pdf"
  );
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [separateChapters, setSeparateChapters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const formats = exportType === "manuscript" ? manuscriptFormats : bibleFormats;

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleClose = () => {
    setExportComplete(false);
    setExportProgress(0);
    onOpenChange(false);
  };

  const selectedFormatData = formats.find((f) => f.id === selectedFormat);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Export {exportType === "manuscript" ? "Manuscript" : "Story Bible"}
          </DialogTitle>
          <DialogDescription>
            Choose a format and options for your export.
          </DialogDescription>
        </DialogHeader>

        {exportComplete ? (
          <div className="flex flex-col items-center py-8">
            <div className="mb-4 rounded-full bg-emerald-500/20 p-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold">Export Complete!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your file has been downloaded.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : isExporting ? (
          <div className="py-8">
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">
                Exporting your {exportType}...
              </p>
            </div>
            <Progress value={exportProgress} className="h-2" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {exportProgress}%
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <Label className="mb-3 block">Format</Label>
                <RadioGroup
                  value={selectedFormat}
                  onValueChange={setSelectedFormat}
                  className="grid gap-2"
                >
                  {formats.map((format) => (
                    <Label
                      key={format.id}
                      htmlFor={format.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent",
                        selectedFormat === format.id && "border-primary bg-accent"
                      )}
                    >
                      <RadioGroupItem value={format.id} id={format.id} />
                      <div
                        className={cn(
                          "rounded-md p-2",
                          selectedFormat === format.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {format.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {format.name}{" "}
                          <span className="text-muted-foreground">
                            ({format.extension})
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Options */}
              {exportType === "manuscript" && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notes"
                        checked={includeNotes}
                        onCheckedChange={(checked) =>
                          setIncludeNotes(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="notes"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Include chapter notes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="comments"
                        checked={includeComments}
                        onCheckedChange={(checked) =>
                          setIncludeComments(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="comments"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Include inline comments
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="separate"
                        checked={separateChapters}
                        onCheckedChange={(checked) =>
                          setSeparateChapters(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="separate"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Export chapters as separate files
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as {selectedFormatData?.extension}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
