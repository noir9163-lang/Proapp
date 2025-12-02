import React, { useState, useEffect } from "react";
import { useGamification } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Zap, Volume2, VolumeX, Music, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import focusImg from '@assets/generated_images/3d_purple_brain_focus_icon.png';

export default function Focus() {
  const { addCoins, addXp, incrementStreak } = useGamification();
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState<"standard" | "ultifocus">("standard");
  const [ambience, setAmbience] = useState<"none" | "rain" | "lofi" | "cafe">("none");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      addCoins(mode === "ultifocus" ? 100 : 50);
      addXp(mode === "ultifocus" ? 100 : 50);
      incrementStreak();
      // Play sound here
      alert("Focus session complete! Rewards added.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (val: number[]) => {
    setDuration(val[0]);
    setTimeLeft(val[0] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className={cn(
      "min-h-[80vh] flex flex-col items-center justify-center transition-colors duration-700",
      mode === "ultifocus" && isActive ? "bg-slate-950 text-purple-100" : ""
    )}>
      
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className={cn("text-4xl font-heading font-bold flex items-center justify-center gap-3", mode === "ultifocus" && isActive && "text-purple-400 animate-pulse")}>
            <img src={focusImg} className="h-10 w-10 animate-bounce-slow" />
            {mode === "ultifocus" ? "ULTIFOCUS MODE" : "Focus Session"}
          </h1>
          <p className={cn("text-muted-foreground", mode === "ultifocus" && isActive && "text-purple-300/70")}>
            {isActive ? "Stay focused. You got this." : "Ready to enter the zone?"}
          </p>
        </div>

        {/* Timer Circle Visual */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
          {/* Outer Glow */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000",
            isActive ? (mode === "ultifocus" ? "bg-purple-600 opacity-40" : "bg-primary opacity-30") : "bg-transparent"
          )}></div>
          
          {/* SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className={cn("text-muted/20", mode === "ultifocus" && isActive && "text-purple-900/30")}
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-linear",
                mode === "ultifocus" ? "text-purple-500" : "text-primary"
              )}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn("text-6xl font-mono font-bold tracking-tighter", mode === "ultifocus" && isActive && "text-white")}>
              {formatTime(timeLeft)}
            </div>
            <div className={cn("text-sm font-medium mt-2", mode === "ultifocus" && isActive ? "text-purple-300" : "text-muted-foreground")}>
              {isActive ? "In Progress" : `${duration} Minutes`}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {!isActive && (
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Duration</span>
                <span>{duration} min</span>
              </div>
              <Slider 
                defaultValue={[25]} 
                max={120} 
                step={5} 
                onValueChange={handleDurationChange}
                className="cursor-pointer"
              />
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium">Mode</span>
                <div className="flex bg-muted p-1 rounded-lg">
                  <button 
                    onClick={() => setMode("standard")}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", mode === "standard" ? "bg-background shadow-sm" : "text-muted-foreground")}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setMode("ultifocus")}
                    className={cn("px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1", mode === "ultifocus" ? "bg-purple-600 text-white shadow-sm" : "text-muted-foreground")}
                  >
                    <Zap className="h-3 w-3" /> UltiFocus
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className={cn("h-16 w-16 rounded-full shadow-xl text-white text-lg", isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90")}
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
            </Button>
            
            {isActive && (
              <Button 
                size="lg" 
                variant="secondary" 
                className="h-16 w-16 rounded-full shadow-md"
                onClick={resetTimer}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Ambience Controls */}
          <div className="flex justify-center gap-4 pt-4">
             <Button 
               variant={ambience === "none" ? "default" : "outline"} 
               size="sm" 
               onClick={() => setAmbience("none")}
               className="rounded-full"
             >
               <VolumeX className="h-4 w-4 mr-2" /> Silent
             </Button>
             <Button 
               variant={ambience === "lofi" ? "default" : "outline"} 
               size="sm" 
               onClick={() => setAmbience("lofi")}
               className="rounded-full"
             >
               <Music className="h-4 w-4 mr-2" /> Lofi
             </Button>
             <Button 
               variant={ambience === "cafe" ? "default" : "outline"} 
               size="sm" 
               onClick={() => setAmbience("cafe")}
               className="rounded-full"
             >
               <Coffee className="h-4 w-4 mr-2" /> Cafe
             </Button>
          </div>
        </div>
      </div>
      
      {/* Background Ambience Overlay (Visual only for mockup) */}
      {mode === "ultifocus" && isActive && (
        <div className="fixed inset-0 bg-slate-950/90 z-0 pointer-events-none"></div>
      )}
    </div>
  );
}
