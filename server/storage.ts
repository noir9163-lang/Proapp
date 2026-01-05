import { type User, type InsertUser, type Alarm, type InsertAlarm, type Note, type InsertNote } from "@shared/schema";
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

  // Note methods
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(userId: string, note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alarms: Map<string, Alarm>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.alarms = new Map();
    this.notes = new Map();
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

  // Note methods
  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.userId === userId,
    );
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(userId: string, insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = {
      ...insertNote,
      id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    const updated: Note = {
      ...note,
      ...updates,
      updatedAt: new Date(),
    };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }
}

export const storage = new MemStorage();
