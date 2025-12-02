import React from "react";
import { useGamification } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Zap, Palette, Lock, Check } from "lucide-react";
import coinImg from '@assets/generated_images/3d_gold_coin_icon.png';

export default function Shop() {
  const { stats, buyItem } = useGamification();

  const items = [
    { id: 1, name: "Streak Freeze", price: 500, category: "powerups", icon: "🧊", description: "Protect your streak for one missed day.", owned: false },
    { id: 2, name: "Double XP Potion", price: 300, category: "powerups", icon: "🧪", description: "Earn 2x XP for the next hour.", owned: false },
    { id: 3, name: "Neon Night Theme", price: 1000, category: "themes", icon: "🌃", description: "A cool dark theme with neon accents.", owned: false },
    { id: 4, name: "Golden Avatar Frame", price: 2500, category: "cosmetics", icon: "🖼️", description: "Show off your wealth with a golden frame.", owned: false },
    { id: 5, name: "Lofi Beats Pack", price: 400, category: "music", icon: "🎧", description: "Unlock 5 new lofi tracks for focus mode.", owned: true },
    { id: 6, name: "Wizard Hat", price: 1500, category: "cosmetics", icon: "🧙‍♂️", description: "A magical hat for your avatar.", owned: false },
  ];

  const handleBuy = (item: any) => {
    if (item.owned) return;
    if (buyItem(item.price)) {
      alert(`Successfully purchased ${item.name}!`);
      // Ideally update local state to show owned
    } else {
      alert("Not enough coins!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-orange-100 p-8 rounded-3xl">
        <div>
          <h1 className="text-4xl font-heading font-bold text-amber-900">Campus Store</h1>
          <p className="text-amber-800 mt-2">Spend your hard-earned coins on rewards!</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 flex items-center gap-3 shadow-lg">
          <img src={coinImg} className="h-12 w-12" />
          <div>
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">Balance</span>
            <span className="text-3xl font-bold text-amber-600">{stats.coins}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="powerups">Power-ups</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-all border-2 hover:border-primary/20">
                <div className="h-32 bg-muted/50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                        {item.category}
                      </span>
                    </div>
                    {item.owned && <Badge variant="secondary" className="bg-green-100 text-green-700"><Check className="h-3 w-3 mr-1" /> Owned</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 h-10">{item.description}</p>
                  <Button 
                    className="w-full font-bold" 
                    variant={item.owned ? "secondary" : "default"}
                    disabled={item.owned}
                    onClick={() => handleBuy(item)}
                  >
                    {item.owned ? "Equip" : (
                      <span className="flex items-center gap-2">
                        Buy for {item.price} <img src={coinImg} className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
