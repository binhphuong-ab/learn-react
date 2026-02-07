import type {
  ActivityTypeDoc,
  ActivityTypeDTO,
  DailyReflectionDoc,
  ProjectDoc,
  ProjectDTO,
  ReflectionDTO,
  TaskDoc,
  TaskDTO,
} from "@/lib/types";

export function serializeActivityType(doc: ActivityTypeDoc): ActivityTypeDTO {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    color: doc.color,
  };
}

export function serializeProject(doc: ProjectDoc): ProjectDTO {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    description: doc.description,
    color: doc.color,
  };
}

export function serializeTask(doc: TaskDoc): TaskDTO {
  return {
    id: doc._id.toHexString(),
    dateKey: doc.dateKey,
    hour: doc.hour,
    note: doc.note,
    activityTypeId: doc.activityTypeId.toHexString(),
    projectId: doc.projectId?.toHexString(),
  };
}

export function serializeReflection(doc: DailyReflectionDoc): ReflectionDTO {
  return {
    id: doc._id.toHexString(),
    dateKey: doc.dateKey,
    plan: doc.plan,
    result: doc.result,
    improvement: doc.improvement,
  };
}
