import { ObjectId } from "mongodb";

export interface UserDoc {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityTypeDoc {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDoc {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDoc {
  _id: ObjectId;
  userId: ObjectId;
  dateKey: string;
  hour: number;
  note: string;
  activityTypeId: ObjectId;
  projectId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyReflectionDoc {
  _id: ObjectId;
  userId: ObjectId;
  dateKey: string;
  plan: string;
  result: string;
  improvement: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  username: string;
}

export interface ActivityTypeDTO {
  id: string;
  name: string;
  color: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface TaskDTO {
  id: string;
  dateKey: string;
  hour: number;
  note: string;
  activityTypeId: string;
  projectId?: string;
}

export interface ReflectionDTO {
  id: string;
  dateKey: string;
  plan: string;
  result: string;
  improvement: string;
}
