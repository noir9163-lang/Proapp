import React, { useState } from "react";
import { useGamification } from "@/lib/gamification";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Sparkles, CheckSquare, Share2, Plus, Search, FileText, MoreVertical, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notes() {
  const { addXp } = useGamification();
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const [notes, setNotes] = useState([
    { id: 1, title: "Calculus - Derivatives", preview: "The derivative of a function of a real variable measures the sensitivity to change of the function value...", date: "2 hours ago", tags: ["Math", "Exam"] },
    { id: 2, title: "History - WWII Causes", preview: "Main causes include the Treaty of Versailles, the rise of fascism in Italy...", date: "Yesterday", tags: ["History"] },
    { id: 3, title: "Chemistry Lab Safety", preview: "Always wear safety goggles. Never taste chemicals. Dispose of waste properly...", date: "2 days ago", tags: ["Science", "Lab"] },
  ]);

  const handleSummarize = () => {
    if (!activeNote) return;
    addXp(15);
    alert("AI is summarizing your note... (Mock: Summary created!)");
  };

  const handleTextToTask = () => {
    if (!activeNote) return;
    addXp(10);
    alert("Converting actionable items to tasks... (Mock: 3 tasks added to Planner)");
  };

  const toggleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        alert("Recording finished! Transcribing... (Mock)");
      }, 3000);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6">
      {/* Sidebar List */}
      <div className={cn(
        "w-full md:w-80 flex-col gap-4 h-full",
        activeNote ? "hidden md:flex" : "flex"
      )}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-9" />
          </div>
          <Button size="icon"><Plus className="h-4 w-4" /></Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {notes.map((note) => (
              <div 
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm text-left",
                  activeNote === note.id ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border"
                )}
              >
                <h3 className="font-bold truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.preview}</p>
                <div className="flex items-center gap-2 mt-3">
                   {note.tags.map(tag => (
                     <span key={tag} className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-md font-medium">#{tag}</span>
                   ))}
                   <span className="text-[10px] text-muted-foreground ml-auto">{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className={cn(
        "flex-1 flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-full",
        activeNote ? "flex" : "hidden md:flex"
      )}>
        {activeNote ? (
          <>
            {/* Toolbar */}
            <div className="border-b border-border p-4 flex items-center justify-between bg-muted/30 overflow-x-auto">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-1" 
                  onClick={() => setActiveNote(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant={isRecording ? "destructive" : "outline"} 
                  size="sm" 
                  onClick={toggleRecord}
                  className={cn("gap-2 rounded-full transition-all whitespace-nowrap", isRecording && "animate-pulse")}
                >
                  <Mic className="h-4 w-4" /> {isRecording ? "Rec..." : "Voice"}
                </Button>
                <div className="h-4 w-px bg-border mx-1"></div>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 whitespace-nowrap" onClick={handleSummarize}>
                  <Sparkles className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">AI Summarize</span><span className="sm:hidden">AI</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleTextToTask} className="whitespace-nowrap">
                  <CheckSquare className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Text-to-Task</span><span className="sm:hidden">Tasks</span>
                </Button>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Editor Content (Mock) */}
            <div className="flex-1 p-8 font-serif text-lg leading-relaxed outline-none overflow-y-auto">
              <h1 className="text-3xl font-bold font-heading mb-6 text-foreground">Calculus - Derivatives</h1>
              <p className="mb-4">The derivative of a function of a real variable measures the sensitivity to change of the function value (output value) with respect to a change in its argument (input value). Derivatives are a fundamental tool of calculus.</p>
              <p className="mb-4">For example, the derivative of the position of a moving object with respect to time is the object's velocity: this measures how quickly the position of the object changes when time advances.</p>
              <h2 className="text-xl font-bold mt-8 mb-4">Key Concepts</h2>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                 <li>Differentiation is the action of computing a derivative.</li>
                 <li>The reverse process is called antidifferentiation.</li>
                 <li>The fundamental theorem of calculus relates antidifferentiation with integration.</li>
              </ul>
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg my-6">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Summary</h3>
                <p className="text-sm text-yellow-900">Derivatives measure instantaneous rate of change. Velocity is the derivative of position. Differentiation finds the derivative, while antidifferentiation reverses it, connecting to integration via the Fundamental Theorem of Calculus.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-20" />
            <p>Select a note to start editing or creating.</p>
          </div>
        )}
      </div>
    </div>
  );
}
