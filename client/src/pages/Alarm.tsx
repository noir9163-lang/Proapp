import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Clock, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAlarmManager } from "@/hooks/useAlarmManager";
import { AlarmRinging } from "@/components/AlarmRinging";
import type { Alarm } from "@shared/schema";

const SOUNDS = [
  { id: "bell", name: "🔔 Bell" },
  { id: "chime", name: "🎵 Chime" },
  { id: "buzz", name: "⚡ Buzz" },
  { id: "piano", name: "🎹 Piano" },
];

const DAYS = [
  { id: "0", name: "Sun" },
  { id: "1", name: "Mon" },
  { id: "2", name: "Tue" },
  { id: "3", name: "Wed" },
  { id: "4", name: "Thu" },
  { id: "5", name: "Fri" },
  { id: "6", name: "Sat" },
];

export default function AlarmPage() {
  const { alarms, activeAlarm, loading, snoozeAlarm, dismissAlarm, fetchAlarms } = useAlarmManager();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    time: "07:00",
    sound: "bell",
    repeatDays: "[]",
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({ label: "", time: "07:00", sound: "bell", repeatDays: "[]" });
    setEditingId(null);
    setShowForm(false);
  };

  const createAlarm = async () => {
    if (!formData.label || !formData.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/alarms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "default-user",
          ...formData,
          enabled: true,
        }),
      });

      if (response.ok) {
        fetchAlarms();
        resetForm();
        toast({
          title: "Success",
          description: "Alarm created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alarm",
        variant: "destructive",
      });
    }
  };

  const updateAlarm = async (id: string) => {
    if (!formData.label || !formData.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/alarms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAlarms();
        resetForm();
        toast({
          title: "Success",
          description: "Alarm updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alarm",
        variant: "destructive",
      });
    }
  };

  const updateAlarmStatus = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/alarms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        fetchAlarms();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alarm",
        variant: "destructive",
      });
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      const response = await fetch(`/api/alarms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAlarms();
        toast({
          title: "Success",
          description: "Alarm deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alarm",
        variant: "destructive",
      });
    }
  };

  const toggleRepeatDay = (dayId: string) => {
    const days = JSON.parse(formData.repeatDays || "[]");
    const index = days.indexOf(dayId);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(dayId);
    }
    setFormData({ ...formData, repeatDays: JSON.stringify(days) });
  };

  const handleEdit = (alarm: Alarm) => {
    setFormData({
      label: alarm.label,
      time: alarm.time,
      sound: alarm.sound,
      repeatDays: alarm.repeatDays || "[]",
    });
    setEditingId(alarm.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Active Alarm Modal */}
      {activeAlarm && (
        <AlarmRinging
          label={activeAlarm.label}
          time={activeAlarm.time}
          snoozeOptions={activeAlarm.snoozeOptions}
          onSnooze={snoozeAlarm}
          onDismiss={dismissAlarm}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Clock className="w-8 h-8" />
            Alarms
          </h1>
          <p className="text-gray-400">Set and manage your daily alarms</p>
        </div>

        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Alarm
          </Button>
        ) : (
          <Card className="mb-6 p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? "Edit Alarm" : "Create New Alarm"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="label" className="text-gray-300">
                  Alarm Label
                </Label>
                <Input
                  id="label"
                  placeholder="e.g., Morning Workout"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-gray-300">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="sound" className="text-gray-300">
                  Sound
                </Label>
                <Select value={formData.sound} onValueChange={(value) =>
                  setFormData({ ...formData, sound: value })
                }>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {SOUNDS.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id} className="text-white">
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-3 block">Repeat Days</Label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleRepeatDay(day.id)}
                      className={`p-2 rounded text-sm font-medium transition ${
                        JSON.parse(formData.repeatDays || "[]").includes(day.id)
                          ? "bg-purple-500 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (editingId) {
                      updateAlarm(editingId);
                    } else {
                      createAlarm();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {editingId ? "Update Alarm" : "Create Alarm"}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-400">Loading alarms...</p>
          ) : alarms.length === 0 ? (
            <Card className="p-6 bg-slate-800 border-slate-700 text-center">
              <p className="text-gray-400">No alarms yet. Create one to get started!</p>
            </Card>
          ) : (
            alarms.map((alarm) => (
              <Card
                key={alarm.id}
                className="p-4 bg-slate-800 border-slate-700 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{alarm.label}</h3>
                  <p className="text-purple-400 text-sm">{alarm.time}</p>
                  {alarm.repeatDays && alarm.repeatDays !== "[]" && (
                    <p className="text-gray-400 text-xs mt-1">
                      Repeats: {JSON.parse(alarm.repeatDays)
                        .map((d: string) => DAYS.find((day) => day.id === d)?.name)
                        .join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={alarm.enabled}
                    onCheckedChange={(checked) =>
                      updateAlarmStatus(alarm.id, checked)
                    }
                  />
                  <Button
                    onClick={() => handleEdit(alarm)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-900 hover:text-blue-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteAlarm(alarm.id)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-900 hover:text-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}