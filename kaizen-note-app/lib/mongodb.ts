import { MongoClient } from "mongodb";

import type {
  ActivityTypeDoc,
  DailyReflectionDoc,
  ProjectDoc,
  TaskDoc,
  UserDoc,
} from "@/lib/types";

declare global {
  var _kaizenMongoClientPromise: Promise<MongoClient> | undefined;
  var _kaizenIndexesPromise: Promise<void> | undefined;
  var _kaizenDbName: string | undefined;
}

function requireMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment.");
  }
  return uri;
}

function inferDbName(rawUri: string): string | undefined {
  try {
    const parsed = new URL(rawUri);
    const name = parsed.pathname.replace("/", "").trim();
    return name.length > 0 ? name : undefined;
  } catch {
    return undefined;
  }
}

function resolveDbName(uri: string): string {
  if (global._kaizenDbName) {
    return global._kaizenDbName;
  }
  const name = process.env.MONGODB_DB ?? inferDbName(uri) ?? "kaizennote";
  global._kaizenDbName = name;
  return name;
}

function getClientPromise(): Promise<MongoClient> {
  if (global._kaizenMongoClientPromise) {
    return global._kaizenMongoClientPromise;
  }

  const uri = requireMongoUri();
  const client = new MongoClient(uri);
  const clientPromise = client.connect().then(() => client);
  global._kaizenMongoClientPromise = clientPromise;
  return clientPromise;
}

async function ensureIndexes() {
  if (global._kaizenIndexesPromise) {
    return global._kaizenIndexesPromise;
  }

  global._kaizenIndexesPromise = (async () => {
    const uri = requireMongoUri();
    const dbName = resolveDbName(uri);
    const db = (await getClientPromise()).db(dbName);
    await Promise.all([
      db.collection<UserDoc>("users").createIndex({ username: 1 }, { unique: true }),
      db
        .collection<ActivityTypeDoc>("activityTypes")
        .createIndex({ userId: 1, name: 1 }, { unique: true }),
      db
        .collection<ProjectDoc>("projects")
        .createIndex({ userId: 1, name: 1 }, { unique: true }),
      db
        .collection<TaskDoc>("tasks")
        .createIndex({ userId: 1, dateKey: 1, hour: 1 }, { unique: true }),
      db.collection<TaskDoc>("tasks").createIndex({ userId: 1, dateKey: 1 }),
      db
        .collection<DailyReflectionDoc>("dailyReflections")
        .createIndex({ userId: 1, dateKey: 1 }, { unique: true }),
    ]);
  })();

  return global._kaizenIndexesPromise;
}

export async function getDb() {
  const uri = requireMongoUri();
  const dbName = resolveDbName(uri);
  await ensureIndexes();
  return (await getClientPromise()).db(dbName);
}

export async function getCollections() {
  const db = await getDb();
  return {
    users: db.collection<UserDoc>("users"),
    activityTypes: db.collection<ActivityTypeDoc>("activityTypes"),
    projects: db.collection<ProjectDoc>("projects"),
    tasks: db.collection<TaskDoc>("tasks"),
    dailyReflections: db.collection<DailyReflectionDoc>("dailyReflections"),
  };
}
