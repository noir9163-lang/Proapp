import React from "react";
import { useGamification } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Users, UserPlus, MessageCircle, Heart } from "lucide-react";

export default function Social() {
  const { stats } = useGamification();

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", xp: 12500, avatar: "SC", isUser: false },
    { rank: 2, name: "Mike Johnson", xp: 11200, avatar: "MJ", isUser: false },
    { rank: 3, name: "Alex Student", xp: stats.xp + 5000, avatar: "AS", isUser: true }, // Mocking user pos
    { rank: 4, name: "Emily Davis", xp: 9800, avatar: "ED", isUser: false },
    { rank: 5, name: "Chris Wilson", xp: 8500, avatar: "CW", isUser: false },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Leaderboard Section */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" /> Global Rankings
          </h1>
          <div className="flex bg-muted p-1 rounded-lg">
             <button className="px-3 py-1 text-xs font-bold bg-background rounded-md shadow-sm">Weekly</button>
             <button className="px-3 py-1 text-xs font-medium text-muted-foreground">All Time</button>
          </div>
        </div>

        <Card className="border-none shadow-lg bg-gradient-to-b from-card to-muted/20">
          <CardContent className="p-0">
             {leaderboard.map((user, index) => (
               <div 
                 key={user.rank}
                 className={`flex items-center p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${user.isUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
               >
                 <div className="w-12 font-bold text-xl text-muted-foreground flex justify-center">
                   {user.rank === 1 ? <Medal className="h-6 w-6 text-yellow-500" /> : 
                    user.rank === 2 ? <Medal className="h-6 w-6 text-slate-400" /> :
                    user.rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> :
                    `#${user.rank}`}
                 </div>
                 <Avatar className="h-10 w-10 border-2 border-background mr-4">
                   <AvatarFallback className={user.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>{user.avatar}</AvatarFallback>
                 </Avatar>
                 <div className="flex-1">
                   <h3 className={`font-bold ${user.isUser ? 'text-primary' : ''}`}>{user.name} {user.isUser && '(You)'}</h3>
                   <p className="text-xs text-muted-foreground">Lvl {Math.floor(user.xp / 1000) + 1} Scholar</p>
                 </div>
                 <div className="font-mono font-bold text-lg text-right">
                   {user.xp.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">XP</span>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      {/* Friends Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <Users className="h-5 w-5" /> Study Buddies
           </h2>
           <Button size="icon" variant="ghost"><UserPlus className="h-4 w-4" /></Button>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>F{i}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Friend {i}</h4>
                  <p className="text-xs text-green-600 font-medium">Studying Math...</p>
                </div>
                <div className="flex gap-1">
                   <Button size="icon" variant="ghost" className="h-8 w-8"><Heart className="h-4 w-4" /></Button>
                   <Button size="icon" variant="ghost" className="h-8 w-8"><MessageCircle className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-1">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-sm">Invite Friends</h4>
              <p className="text-xs text-muted-foreground">Study together and earn +10% XP boost!</p>
              <Button size="sm" variant="outline" className="w-full mt-2">Copy Invite Link</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
