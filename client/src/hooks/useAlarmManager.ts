import { useState, useEffect, useCallback, useRef } from "react";
import type { Alarm } from "@shared/schema";
import { alarmSounds } from "@/lib/alarmSounds";
import { alarmStorage } from "@/lib/alarmStorage";
import { useToast } from "./use-toast";

interface ActiveAlarm extends Alarm {
  snoozeOptions: number[];
}

export function useAlarmManager() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarm | null>(null);
  const [loading, setLoading] = useState(true);
  // Use ReturnType<typeof setInterval> so it's compatible with browsers
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  // Fetch alarms from server
  const fetchAlarms = useCallback(async () => {
    try {
      const response = await fetch("/api/alarms?userId=default-user");
      if (response.ok) {
        const data = await response.json();
        setAlarms(data);
      }
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger alarm
  const triggerAlarm = useCallback(
    async (alarm: Alarm) => {
      try {
        // Play sound
        await alarmSounds.playSound(alarm.sound as any);

        // Request notification permission if needed
        if ("Notification" in window && Notification.permission !== "granted") {
          try {
            // Requesting permission is async; ignore result if user blocks
            // but we still proceed with the modal and sound
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Notification.requestPermission();
          } catch {}
        }

        // Show notification if granted
        if ("Notification" in window && Notification.permission === "granted") {
          // Note: creating notification may throw on some platforms; guard it
          try {
            // requireInteraction ensures it remains until user acts (Chrome)
            // tag groups notifications by alarm
            new Notification(alarm.label, {
              body: "Tap snooze or dismiss.",
              icon: "/favicon.png",
              tag: `alarm-${alarm.id}`,
              requireInteraction: true,
            });
          } catch (e) {
            console.warn("Notification failed:", e);
          }
        }

        // Set active alarm modal
        setActiveAlarm({
          ...alarm,
          snoozeOptions: [5, 10, 15],
        });

        // Mark as triggered on server
        await fetch(`/api/alarms/${alarm.id}/trigger`, {
          method: "POST",
        });

        toast({
          title: alarm.label,
          description: "Alarm triggered!",
        });
      } catch (error) {
        console.error("Failed to trigger alarm:", error);
      }
    },
    [toast]
  );

  // Check if alarm should trigger
  const checkAlarmTrigger = useCallback(async () => {
    if (alarms.length === 0) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const currentDay = String(now.getDay());
    const today = now.toDateString();

    for (const alarm of alarms) {
      try {
        if (!alarm.enabled) continue;
        if (activeAlarm?.id === alarm.id) continue;

        // Skip if snoozed (alarmStorage handles timestamp comparison)
        if (alarmStorage.isAlarmSnoozed(alarm.id)) continue;

        // Safe parse repeatDays
        let repeatDays: string[] = [];
        try {
          const parsed = JSON.parse(alarm.repeatDays || "[]");
          if (Array.isArray(parsed)) repeatDays = parsed;
        } catch {
          repeatDays = [];
        }

        const isRepeatDay = repeatDays.length === 0 || repeatDays.includes(currentDay);

        if (alarm.time === currentTime && isRepeatDay) {
          // Check if already triggered today
          if (alarm.lastTriggered) {
            const lastTriggeredDate = new Date(alarm.lastTriggered).toDateString();
            if (lastTriggeredDate === today) {
              continue;
            }
          }

          // Trigger alarm
          await triggerAlarm(alarm);
        }
      } catch (err) {
        // Catch per-alarm errors so one bad alarm doesn't stop the loop
        console.error("Error checking alarm", alarm?.id, err);
      }
    }
  }, [alarms, activeAlarm, triggerAlarm]);

  // Snooze alarm
  const snoozeAlarm = useCallback(
    async (minutes: number) => {
      if (!activeAlarm) return;

      try {
        alarmSounds.stopSound();
        alarmStorage.snoozeAlarm(activeAlarm.id, minutes);

        const response = await fetch(`/api/alarms/${activeAlarm.id}/snooze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ minutes }),
        });

        if (response.ok) {
          setActiveAlarm(null);
          toast({
            title: "Snoozed",
            description: `Alarm snoozed for ${minutes} minutes`,
          });
        }
      } catch (error) {
        console.error("Failed to snooze alarm:", error);
      }
    },
    [activeAlarm, toast]
  );

  // Dismiss alarm
  const dismissAlarm = useCallback(
    async () => {
      if (!activeAlarm) return;

      try {
        alarmSounds.stopSound();
        alarmStorage.dismissAlarm(activeAlarm.id);

        const response = await fetch(`/api/alarms/${activeAlarm.id}/dismiss`, {
          method: "POST",
        });

        if (response.ok) {
          setActiveAlarm(null);
          toast({
            title: "Dismissed",
            description: "Alarm dismissed",
          });
        }
      } catch (error) {
        console.error("Failed to dismiss alarm:", error);
      }
    },
    [activeAlarm, toast]
  );

  // Start polling
  useEffect(() => {
    fetchAlarms();

    pollingIntervalRef.current = setInterval(() => {
      checkAlarmTrigger();
    }, 10000); // Check every 10 seconds

    return () => {
      if (pollingIntervalRef.current !== null) {
        clearInterval(pollingIntervalRef.current);
      }
      alarmSounds.stopSound();
    };
  }, [fetchAlarms, checkAlarmTrigger]);

  return {
    alarms,
    activeAlarm,
    loading,
    snoozeAlarm,
    dismissAlarm,
    fetchAlarms,
  };
}