import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertAlarm } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Alarm routes
  app.get("/api/alarms", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const alarms = await storage.getAlarms(userId);
      res.json(alarms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alarms" });
    }
  });

  app.get("/api/alarms/:id", async (req, res) => {
    try {
      const alarm = await storage.getAlarm(req.params.id);
      if (!alarm) {
        return res.status(404).json({ error: "Alarm not found" });
      }
      res.json(alarm);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alarm" });
    }
  });

  app.post("/api/alarms", async (req, res) => {
    try {
      const { userId, ...alarmData } = req.body as { userId: string } & InsertAlarm;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const alarm = await storage.createAlarm(userId, alarmData);
      res.status(201).json(alarm);
    } catch (error) {
      res.status(500).json({ error: "Failed to create alarm" });
    }
  });

  app.put("/api/alarms/:id", async (req, res) => {
    try {
      const alarm = await storage.updateAlarm(req.params.id, req.body);
      if (!alarm) {
        return res.status(404).json({ error: "Alarm not found" });
      }
      res.json(alarm);
    } catch (error) {
      res.status(500).json({ error: "Failed to update alarm" });
    }
  });

  app.delete("/api/alarms/:id", async (req, res) => {
    try {
      const success = await storage.deleteAlarm(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Alarm not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete alarm" });
    }
  });

  return httpServer;
}
