/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const TIME_ZONE = "Asia/Ho_Chi_Minh";
const DEFAULT_DB_NAME = "kaizennote";

const USERS = [
  { username: "binhphuong", password: "Minato@123" },
  { username: "ngocle", password: "Minato@123" },
];

const ACTIVITIES = [
  { name: "Sleep", color: "#64748b" },
  { name: "Exercise", color: "#10b981" },
  { name: "Learn Code", color: "#3b82f6" },
  { name: "Reading", color: "#f59e0b" },
  { name: "Working", color: "#8b5cf6" },
];

const PROJECTS = [
  {
    name: "KaizenNote Build",
    description: "Product and feature development work.",
    color: "#2563eb",
  },
  {
    name: "Personal Growth",
    description: "Exercise, reading, and daily learning.",
    color: "#f97316",
  },
];

function extractUriFromMongoAtlasMd(cwd) {
  try {
    const content = fs.readFileSync(path.join(cwd, "mongoatlas.md"), "utf8");
    const match = content.match(/mongodb\+srv:\/\/[^\s`]+/);
    return match ? match[0] : undefined;
  } catch {
    return undefined;
  }
}

function inferDbNameFromUri(uri) {
  try {
    const parsed = new URL(uri);
    const fromPath = parsed.pathname.replace("/", "").trim();
    if (fromPath) {
      return fromPath;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function dateKeyInTimeZone(date = new Date(), timeZone = TIME_ZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDateKey(dateKey, days) {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateKey(date);
}

function startOfWeekDateKey(anchorDateKey) {
  const date = parseDateKey(anchorDateKey);
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  return shiftDateKey(anchorDateKey, -mondayOffset);
}

function recentTwoWeekDateKeys() {
  const today = dateKeyInTimeZone();
  const currentWeekStart = startOfWeekDateKey(today);
  const previousWeekStart = shiftDateKey(currentWeekStart, -7);
  return Array.from({ length: 14 }, (_, index) =>
    shiftDateKey(previousWeekStart, index),
  );
}

function isWeekday(dateKey) {
  const day = parseDateKey(dateKey).getUTCDay();
  return day >= 1 && day <= 5;
}

function buildTaskTemplates(dateKey) {
  const weekday = isWeekday(dateKey);
  const templates = [];

  for (let hour = 0; hour <= 6; hour += 1) {
    templates.push({
      hour,
      activity: "Sleep",
      note: "Core sleep block",
    });
  }
  templates.push({
    hour: 23,
    activity: "Sleep",
    note: "Wind down and sleep",
  });

  if (weekday) {
    [9, 10, 11, 13, 14, 15, 16, 17].forEach((hour) => {
      templates.push({
        hour,
        activity: "Working",
        project: "KaizenNote Build",
        note: "Feature development and execution",
      });
    });

    templates.push({
      hour: 6,
      activity: "Exercise",
      project: "Personal Growth",
      note: "Morning exercise routine",
    });

    templates.push({
      hour: 20,
      activity: "Learn Code",
      project: "KaizenNote Build",
      note: "Code learning and implementation practice",
    });

    templates.push({
      hour: 21,
      activity: "Reading",
      project: "Personal Growth",
      note: "Reading and notes",
    });
  } else {
    templates.push({
      hour: 8,
      activity: "Exercise",
      project: "Personal Growth",
      note: "Weekend workout",
    });
    templates.push({
      hour: 10,
      activity: "Reading",
      project: "Personal Growth",
      note: "Long-form reading",
    });
    templates.push({
      hour: 14,
      activity: "Learn Code",
      project: "KaizenNote Build",
      note: "Deep work learning session",
    });
    templates.push({
      hour: 16,
      activity: "Working",
      project: "KaizenNote Build",
      note: "Weekly planning and backlog grooming",
    });
  }

  return templates;
}

function buildReflection(dateKey, weekday) {
  return {
    dateKey,
    plan: weekday
      ? "Focus on priority tasks, protect deep-work blocks, and review the day."
      : "Recover, plan ahead, and keep momentum with light progress.",
    result: weekday
      ? "Completed planned blocks with minor adjustments in the afternoon."
      : "Finished personal improvement blocks and prepared next week.",
    improvement:
      "Reduce context switching by batching similar tasks and protect evening wind-down time.",
  };
}

async function ensureUser(usersCollection, username, password) {
  const now = new Date();
  const passwordHash = await bcrypt.hash(password, 12);

  await usersCollection.updateOne(
    { username },
    {
      $set: { passwordHash, updatedAt: now },
      $setOnInsert: { _id: new ObjectId(), createdAt: now },
    },
    { upsert: true },
  );

  return usersCollection.findOne({ username });
}

async function ensureActivities(activityCollection, userId) {
  const now = new Date();

  await Promise.all(
    ACTIVITIES.map((activity) =>
      activityCollection.updateOne(
        { userId, name: activity.name },
        {
          $set: { color: activity.color, updatedAt: now },
          $setOnInsert: { _id: new ObjectId(), createdAt: now },
        },
        { upsert: true },
      ),
    ),
  );

  const docs = await activityCollection.find({ userId }).toArray();
  const map = new Map(docs.map((doc) => [doc.name, doc._id]));
  return map;
}

async function ensureProjects(projectCollection, userId) {
  const now = new Date();

  await Promise.all(
    PROJECTS.map((project) =>
      projectCollection.updateOne(
        { userId, name: project.name },
        {
          $set: {
            description: project.description,
            color: project.color,
            updatedAt: now,
          },
          $setOnInsert: { _id: new ObjectId(), createdAt: now },
        },
        { upsert: true },
      ),
    ),
  );

  const docs = await projectCollection.find({ userId }).toArray();
  const map = new Map(docs.map((doc) => [doc.name, doc._id]));
  return map;
}

async function seedTasksAndReflections({
  tasksCollection,
  reflectionsCollection,
  userId,
  activityMap,
  projectMap,
  dateKeys,
}) {
  const now = new Date();

  const taskOps = [];
  const reflectionOps = [];

  for (const dateKey of dateKeys) {
    const weekday = isWeekday(dateKey);
    const templates = buildTaskTemplates(dateKey);
    for (const template of templates) {
      const activityId = activityMap.get(template.activity);
      if (!activityId) {
        continue;
      }

      const projectId = template.project ? projectMap.get(template.project) : undefined;
      taskOps.push({
        updateOne: {
          filter: { userId, dateKey, hour: template.hour },
          update: {
            $set: {
              note: template.note,
              activityTypeId: activityId,
              ...(projectId ? { projectId } : {}),
              updatedAt: now,
            },
            ...(projectId ? {} : { $unset: { projectId: "" } }),
            $setOnInsert: { _id: new ObjectId(), createdAt: now },
          },
          upsert: true,
        },
      });
    }

    const reflection = buildReflection(dateKey, weekday);
    reflectionOps.push({
      updateOne: {
        filter: { userId, dateKey },
        update: {
          $set: {
            plan: reflection.plan,
            result: reflection.result,
            improvement: reflection.improvement,
            updatedAt: now,
          },
          $setOnInsert: { _id: new ObjectId(), createdAt: now },
        },
        upsert: true,
      },
    });
  }

  if (taskOps.length > 0) {
    await tasksCollection.bulkWrite(taskOps, { ordered: false });
  }
  if (reflectionOps.length > 0) {
    await reflectionsCollection.bulkWrite(reflectionOps, { ordered: false });
  }
}

async function fetchSummary({
  tasksCollection,
  reflectionsCollection,
  userId,
  username,
  startDate,
  endDate,
}) {
  const [taskCount, reflectionCount, sampleTasks] = await Promise.all([
    tasksCollection.countDocuments({
      userId,
      dateKey: { $gte: startDate, $lte: endDate },
    }),
    reflectionsCollection.countDocuments({
      userId,
      dateKey: { $gte: startDate, $lte: endDate },
    }),
    tasksCollection
      .find({ userId, dateKey: { $gte: startDate, $lte: endDate } })
      .sort({ dateKey: -1, hour: -1 })
      .limit(6)
      .project({ dateKey: 1, hour: 1, note: 1 })
      .toArray(),
  ]);

  return {
    username,
    dateRange: `${startDate} to ${endDate}`,
    taskCount,
    reflectionCount,
    sampleTasks: sampleTasks.map((item) => ({
      dateKey: item.dateKey,
      hour: item.hour,
      note: item.note,
    })),
  };
}

async function main() {
  const cwd = process.cwd();
  const uri = process.env.MONGODB_URI || extractUriFromMongoAtlasMd(cwd);
  if (!uri) {
    throw new Error("Missing MONGODB_URI and unable to read URI from mongoatlas.md");
  }

  const dbName =
    process.env.MONGODB_DB || inferDbNameFromUri(uri) || DEFAULT_DB_NAME;

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const activityCollection = db.collection("activityTypes");
    const projectCollection = db.collection("projects");
    const tasksCollection = db.collection("tasks");
    const reflectionsCollection = db.collection("dailyReflections");

    const dateKeys = recentTwoWeekDateKeys();
    const startDate = dateKeys[0];
    const endDate = dateKeys[dateKeys.length - 1];

    const summaries = [];
    for (const user of USERS) {
      const userDoc = await ensureUser(
        usersCollection,
        user.username,
        user.password,
      );
      if (!userDoc) {
        throw new Error(`Failed to ensure user ${user.username}`);
      }

      const userId = userDoc._id;
      const activityMap = await ensureActivities(activityCollection, userId);
      const projectMap = await ensureProjects(projectCollection, userId);

      await seedTasksAndReflections({
        tasksCollection,
        reflectionsCollection,
        userId,
        activityMap,
        projectMap,
        dateKeys,
      });

      const summary = await fetchSummary({
        tasksCollection,
        reflectionsCollection,
        userId,
        username: user.username,
        startDate,
        endDate,
      });
      summaries.push(summary);
    }

    console.log(
      JSON.stringify(
        {
          dbName,
          seededWeeks: 2,
          seededDateRange: `${startDate} to ${endDate}`,
          users: summaries,
        },
        null,
        2,
      ),
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
