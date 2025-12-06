import { type User, type InsertUser, type Alarm, type InsertAlarm } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Alarm methods
  getAlarms(userId: string): Promise<Alarm[]>;
  getAlarm(id: string): Promise<Alarm | undefined>;
  createAlarm(userId: string, alarm: InsertAlarm): Promise<Alarm>;
  updateAlarm(id: string, alarm: Partial<InsertAlarm & { lastTriggered?: Date; snoozeUntil?: Date | null }>): Promise<Alarm | undefined>;
  deleteAlarm(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alarms: Map<string, Alarm>;

  constructor() {
    this.users = new Map();
    this.alarms = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Alarm methods
  async getAlarms(userId: string): Promise<Alarm[]> {
    return Array.from(this.alarms.values()).filter(
      (alarm) => alarm.userId === userId,
    );
  }

  async getAlarm(id: string): Promise<Alarm | undefined> {
    return this.alarms.get(id);
  }

  async createAlarm(userId: string, insertAlarm: InsertAlarm): Promise<Alarm> {
    const id = randomUUID();
    const now = new Date();
    const alarm: Alarm = {
      ...insertAlarm,
      id,
      userId,
      createdAt: now,
      updatedAt: now,
    } as Alarm;
    this.alarms.set(id, alarm);
    return alarm;
  }

  async updateAlarm(
    id: string,
    updates: Partial<InsertAlarm & { lastTriggered?: Date; snoozeUntil?: Date | null }>
  ): Promise<Alarm | undefined> {
    const alarm = this.alarms.get(id);
    if (!alarm) return undefined;
    const updated: Alarm = {
      ...alarm,
      ...updates,
      updatedAt: new Date(),
    };
    this.alarms.set(id, updated);
    return updated;
  }

  async deleteAlarm(id: string): Promise<boolean> {
    return this.alarms.delete(id);
  }
}

export const storage = new MemStorage();
