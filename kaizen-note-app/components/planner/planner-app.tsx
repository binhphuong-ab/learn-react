"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  dateKeyInTimeZone,
  shiftDateKey,
  startOfWeekDateKey,
  weekDateKeys,
} from "@/lib/date";
import type {
  ActivityTypeDTO,
  ProjectDTO,
  ReflectionDTO,
  TaskDTO,
} from "@/lib/types";

type TabKey = "planner" | "dashboard" | "settings" | "profile";

interface PlannerAppProps {
  username: string;
}

interface ActivityReportItem {
  activityTypeId: string;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

interface ProjectReportItem {
  projectId?: string;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

interface WeeklyOverviewDay {
  dateKey: string;
  hours: number;
}

interface TrendItem {
  weekStart: string;
  weekEnd: string;
  hours: number;
}

interface TaskClipboard {
  note: string;
  activityTypeId: string;
  projectId: string;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatDateLabel(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatShortWeekday(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

function formatMonthDay(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function withAlpha(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) {
    return hex;
  }

  const red = Number.parseInt(cleaned.slice(0, 2), 16);
  const green = Number.parseInt(cleaned.slice(2, 4), 16);
  const blue = Number.parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function isTextEntryElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export function PlannerApp({ username }: PlannerAppProps) {
  const todayDateKey = useMemo(() => dateKeyInTimeZone(), []);

  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("planner");
  const [weekStart, setWeekStart] = useState<string>(startOfWeekDateKey());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(weekStart);
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [reflectionFocusDateKey, setReflectionFocusDateKey] =
    useState<string>(todayDateKey);
  const [taskClipboard, setTaskClipboard] = useState<TaskClipboard | null>(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingTask, setSavingTask] = useState(false);
  const [savingReflection, setSavingReflection] = useState<string | null>(null);
  const [settingsBusy, setSettingsBusy] = useState(false);

  const [activities, setActivities] = useState<ActivityTypeDTO[]>([]);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [reflectionDrafts, setReflectionDrafts] = useState<
    Record<string, Pick<ReflectionDTO, "plan" | "result" | "improvement">>
  >({});

  const [taskNote, setTaskNote] = useState("");
  const [taskActivityTypeId, setTaskActivityTypeId] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [taskEditorTouched, setTaskEditorTouched] = useState(false);

  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityColor, setNewActivityColor] = useState("#2563eb");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#f97316");

  const [reportStartDate, setReportStartDate] = useState(weekStart);
  const [reportEndDate, setReportEndDate] = useState(shiftDateKey(weekStart, 6));
  const [activityReport, setActivityReport] = useState<ActivityReportItem[]>([]);
  const [projectReport, setProjectReport] = useState<ProjectReportItem[]>([]);
  const [weeklyDayTotals, setWeeklyDayTotals] = useState<WeeklyOverviewDay[]>([]);
  const [trendItems, setTrendItems] = useState<TrendItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const gridScrollerRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const saveTaskActionRef = useRef<() => Promise<void>>(async () => {});
  const deleteTaskActionRef = useRef<() => Promise<void>>(async () => {});

  const weekDates = useMemo(() => weekDateKeys(weekStart), [weekStart]);

  const taskByCell = useMemo(() => {
    const map = new Map<string, TaskDTO>();
    for (const task of tasks) {
      map.set(`${task.dateKey}-${task.hour}`, task);
    }
    return map;
  }, [tasks]);

  const selectedTask = taskByCell.get(`${selectedDateKey}-${selectedHour}`);

  const reflectionCarouselDates = useMemo(
    () => [
      shiftDateKey(reflectionFocusDateKey, -1),
      reflectionFocusDateKey,
      shiftDateKey(reflectionFocusDateKey, 1),
    ],
    [reflectionFocusDateKey],
  );

  const weeklyChartStats = useMemo(() => {
    const totalHours = weeklyDayTotals.reduce((sum, item) => sum + item.hours, 0);
    const maxHours = Math.max(...weeklyDayTotals.map((item) => item.hours), 1);
    const busiestDay = weeklyDayTotals.reduce<WeeklyOverviewDay | null>(
      (best, item) => {
        if (!best || item.hours > best.hours) {
          return item;
        }
        return best;
      },
      null,
    );

    return {
      totalHours,
      maxHours,
      busiestDay,
    };
  }, [weeklyDayTotals]);

  const trendChart = useMemo(() => {
    const width = 680;
    const height = 260;
    const padding = 30;
    const baseline = height - padding;

    if (trendItems.length === 0) {
      return {
        width,
        height,
        padding,
        baseline,
        maxValue: 0,
        points: [] as Array<{ x: number; y: number; item: TrendItem }>,
        linePath: "",
        areaPath: "",
        gridValues: [] as number[],
      };
    }

    const maxValue = Math.max(...trendItems.map((item) => item.hours), 1);
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const points = trendItems.map((item, index) => {
      const x =
        trendItems.length === 1
          ? padding + chartWidth / 2
          : padding + (index / (trendItems.length - 1)) * chartWidth;
      const y = baseline - (item.hours / maxValue) * chartHeight;
      return { x, y, item };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath = points.length
      ? `M ${points[0].x} ${baseline} ${points
          .map((point) => `L ${point.x} ${point.y}`)
          .join(" ")} L ${points[points.length - 1].x} ${baseline} Z`
      : "";

    const gridValues = Array.from(
      new Set([0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxValue * ratio))),
    ).sort((a, b) => a - b);

    return {
      width,
      height,
      padding,
      baseline,
      maxValue,
      points,
      linePath,
      areaPath,
      gridValues,
    };
  }, [trendItems]);

  const fetchJSON = useCallback(
    async <T,>(url: string, init?: RequestInit): Promise<T> => {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (response.status === 401) {
        router.push("/login");
        router.refresh();
        throw new Error("Unauthorized");
      }

      const data = (await response.json()) as T & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
      }
      return data;
    },
    [router],
  );

  const loadSettings = useCallback(async () => {
    const [activityResponse, projectResponse] = await Promise.all([
      fetchJSON<{ items: ActivityTypeDTO[] }>("/api/activity-types"),
      fetchJSON<{ items: ProjectDTO[] }>("/api/projects"),
    ]);
    setActivities(activityResponse.items);
    setProjects(projectResponse.items);
  }, [fetchJSON]);

  const loadWeekData = useCallback(
    async (currentWeekStart: string) => {
      const weekEnd = shiftDateKey(currentWeekStart, 6);
      const [taskResponse, reflectionResponse] = await Promise.all([
        fetchJSON<{ items: TaskDTO[] }>(
          `/api/tasks?startDate=${currentWeekStart}&endDate=${weekEnd}`,
        ),
        fetchJSON<{ items: ReflectionDTO[] }>(
          `/api/reflections?startDate=${currentWeekStart}&endDate=${weekEnd}`,
        ),
      ]);

      setTasks(taskResponse.items);

      const reflectionMap: Record<string, ReflectionDTO> = {};
      for (const item of reflectionResponse.items) {
        reflectionMap[item.dateKey] = item;
      }
      const draftMap: Record<
        string,
        Pick<ReflectionDTO, "plan" | "result" | "improvement">
      > = {};
      for (const dateKey of weekDateKeys(currentWeekStart)) {
        const existing = reflectionMap[dateKey];
        draftMap[dateKey] = {
          plan: existing?.plan ?? "",
          result: existing?.result ?? "",
          improvement: existing?.improvement ?? "",
        };
      }
      setReflectionDrafts(draftMap);
    },
    [fetchJSON],
  );

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    setError(null);
    try {
      const [activityResponse, projectResponse, weeklyResponse, trendsResponse] =
        await Promise.all([
          fetchJSON<{ items: ActivityReportItem[] }>(
            `/api/reports/activity-distribution?startDate=${reportStartDate}&endDate=${reportEndDate}`,
          ),
          fetchJSON<{ items: ProjectReportItem[] }>(
            `/api/reports/project-distribution?startDate=${reportStartDate}&endDate=${reportEndDate}`,
          ),
          fetchJSON<{ dayTotals: WeeklyOverviewDay[] }>(
            `/api/reports/weekly-overview?weekStart=${weekStart}`,
          ),
          fetchJSON<{ items: TrendItem[] }>("/api/reports/trends?weeks=8"),
        ]);

      setActivityReport(activityResponse.items);
      setProjectReport(projectResponse.items);
      setWeeklyDayTotals(weeklyResponse.dayTotals);
      setTrendItems(trendsResponse.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reports.");
    } finally {
      setReportsLoading(false);
    }
  }, [fetchJSON, reportEndDate, reportStartDate, weekStart]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        await loadSettings();
        await loadWeekData(weekStart);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load data.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loadSettings, loadWeekData, weekStart]);

  useEffect(() => {
    const fallbackActivityId = activities[0]?.id ?? "";
    if (!selectedTask) {
      setTaskNote("");
      setTaskActivityTypeId(fallbackActivityId);
      setTaskProjectId("");
      setTaskEditorTouched(false);
      return;
    }

    setTaskNote(selectedTask.note ?? "");
    setTaskActivityTypeId(selectedTask.activityTypeId ?? fallbackActivityId);
    setTaskProjectId(selectedTask.projectId ?? "");
    setTaskEditorTouched(false);
  }, [activities, selectedTask]);

  useEffect(() => {
    setSelectedDateKey(weekStart);
    setReportStartDate(weekStart);
    setReportEndDate(shiftDateKey(weekStart, 6));
    setIsTaskEditorOpen(false);
    const weekEnd = shiftDateKey(weekStart, 6);
    setReflectionFocusDateKey(
      todayDateKey >= weekStart && todayDateKey <= weekEnd
        ? todayDateKey
        : shiftDateKey(weekStart, 3),
    );
  }, [todayDateKey, weekStart]);

  useEffect(() => {
    if (!isTaskEditorOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setIsTaskEditorOpen(false);
        return;
      }

      if (savingTask) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void saveTaskActionRef.current();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        void deleteTaskActionRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isTaskEditorOpen, savingTask]);

  async function saveTask() {
    const emptyUntouchedNewCell =
      !selectedTask &&
      !taskEditorTouched &&
      taskNote.trim().length === 0 &&
      taskProjectId.trim().length === 0;
    if (emptyUntouchedNewCell) {
      setError(null);
      setIsTaskEditorOpen(false);
      return;
    }

    if (!taskActivityTypeId) {
      setError("Please select an activity type.");
      return;
    }

    setSavingTask(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: TaskDTO }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          dateKey: selectedDateKey,
          hour: selectedHour,
          note: taskNote,
          activityTypeId: taskActivityTypeId,
          projectId: taskProjectId || null,
        }),
      });

      setTasks((previous) => {
        const others = previous.filter(
          (task) =>
            !(task.dateKey === response.item.dateKey && task.hour === response.item.hour),
        );
        return [...others, response.item].sort((a, b) =>
          a.dateKey === b.dateKey ? a.hour - b.hour : a.dateKey.localeCompare(b.dateKey),
        );
      });
      setIsTaskEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save task.");
    } finally {
      setSavingTask(false);
    }
  }

  async function deleteTask() {
    if (!selectedTask) {
      setTaskNote("");
      setTaskProjectId("");
      return;
    }

    setSavingTask(true);
    setError(null);
    try {
      await fetchJSON<{ success: true }>(`/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
      });
      setTasks((previous) => previous.filter((task) => task.id !== selectedTask.id));
      setTaskNote("");
      setTaskProjectId("");
      setTaskEditorTouched(false);
      setIsTaskEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task.");
    } finally {
      setSavingTask(false);
    }
  }

  saveTaskActionRef.current = saveTask;
  deleteTaskActionRef.current = deleteTask;

  async function saveReflection(dateKey: string) {
    const draft = reflectionDrafts[dateKey] ?? {
      plan: "",
      result: "",
      improvement: "",
    };

    setSavingReflection(dateKey);
    setError(null);
    try {
      await fetchJSON<{ item: ReflectionDTO }>("/api/reflections", {
        method: "POST",
        body: JSON.stringify({ dateKey, ...draft }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save reflection.");
    } finally {
      setSavingReflection(null);
    }
  }

  async function createActivity() {
    if (!newActivityName.trim()) {
      return;
    }

    setSettingsBusy(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: ActivityTypeDTO }>("/api/activity-types", {
        method: "POST",
        body: JSON.stringify({
          name: newActivityName.trim(),
          color: newActivityColor,
        }),
      });
      setActivities((previous) => [...previous, response.item]);
      setNewActivityName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create activity.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function updateActivity(activity: ActivityTypeDTO) {
    setSettingsBusy(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: ActivityTypeDTO }>(
        `/api/activity-types/${activity.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: activity.name,
            color: activity.color,
          }),
        },
      );
      setActivities((previous) =>
        previous.map((item) => (item.id === activity.id ? response.item : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update activity.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function deleteActivity(activityId: string) {
    setSettingsBusy(true);
    setError(null);
    try {
      await fetchJSON<{ success: true }>(`/api/activity-types/${activityId}`, {
        method: "DELETE",
      });
      setActivities((previous) => previous.filter((item) => item.id !== activityId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete activity.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function createProject() {
    if (!newProjectName.trim()) {
      return;
    }

    setSettingsBusy(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: ProjectDTO }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDescription.trim(),
          color: newProjectColor,
        }),
      });
      setProjects((previous) => [...previous, response.item]);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create project.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function updateProject(project: ProjectDTO) {
    setSettingsBusy(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: ProjectDTO }>(`/api/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: project.name,
          description: project.description ?? "",
          color: project.color,
        }),
      });
      setProjects((previous) =>
        previous.map((item) => (item.id === project.id ? response.item : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update project.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function deleteProject(projectId: string) {
    setSettingsBusy(true);
    setError(null);
    try {
      await fetchJSON<{ success: true }>(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      setProjects((previous) => previous.filter((item) => item.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete project.");
    } finally {
      setSettingsBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function copyTaskToClipboard() {
    if (!taskActivityTypeId) {
      setError("Please select an activity type before copying.");
      return;
    }

    setTaskClipboard({
      note: taskNote,
      activityTypeId: taskActivityTypeId,
      projectId: taskProjectId,
    });
    setCopyFeedback("Copied");
    setError(null);
    window.setTimeout(() => setCopyFeedback(""), 1200);
  }

  function pasteTaskFromClipboard() {
    if (!taskClipboard) {
      setError("No copied block yet.");
      return;
    }

    const hasActivity = activities.some(
      (activity) => activity.id === taskClipboard.activityTypeId,
    );
    const hasProject =
      !taskClipboard.projectId ||
      projects.some((project) => project.id === taskClipboard.projectId);

    const fallbackActivityId = activities[0]?.id ?? "";
    setTaskNote(taskClipboard.note);
    setTaskActivityTypeId(
      hasActivity ? taskClipboard.activityTypeId : fallbackActivityId,
    );
    setTaskProjectId(hasProject ? taskClipboard.projectId : "");
    setError(null);
  }

  const copySelectedCellTask = useCallback(() => {
    if (!selectedTask) {
      setError("Selected box has no task to copy.");
      return;
    }

    setTaskClipboard({
      note: selectedTask.note ?? "",
      activityTypeId: selectedTask.activityTypeId,
      projectId: selectedTask.projectId ?? "",
    });
    setCopyFeedback("Copied");
    setError(null);
    window.setTimeout(() => setCopyFeedback(""), 1200);
  }, [selectedTask]);

  const pasteToSelectedCell = useCallback(async () => {
    if (!taskClipboard) {
      setError("No copied block yet.");
      return;
    }

    const hasActivity = activities.some(
      (activity) => activity.id === taskClipboard.activityTypeId,
    );
    const hasProject =
      !taskClipboard.projectId ||
      projects.some((project) => project.id === taskClipboard.projectId);
    const fallbackActivityId = activities[0]?.id ?? "";
    const activityTypeId = hasActivity
      ? taskClipboard.activityTypeId
      : fallbackActivityId;
    const projectId = hasProject ? taskClipboard.projectId : "";

    if (!activityTypeId) {
      setError("No activity type available for paste.");
      return;
    }

    setSavingTask(true);
    setError(null);
    try {
      const response = await fetchJSON<{ item: TaskDTO }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          dateKey: selectedDateKey,
          hour: selectedHour,
          note: taskClipboard.note,
          activityTypeId,
          projectId: projectId || null,
        }),
      });

      setTasks((previous) => {
        const others = previous.filter(
          (task) =>
            !(task.dateKey === response.item.dateKey && task.hour === response.item.hour),
        );
        return [...others, response.item].sort((a, b) =>
          a.dateKey === b.dateKey ? a.hour - b.hour : a.dateKey.localeCompare(b.dateKey),
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to paste to selected box.");
    } finally {
      setSavingTask(false);
    }
  }, [
    activities,
    fetchJSON,
    projects,
    selectedDateKey,
    selectedHour,
    taskClipboard,
  ]);

  const clearSelectedCellTask = useCallback(async () => {
    if (!selectedTask) {
      return;
    }

    setSavingTask(true);
    setError(null);
    try {
      await fetchJSON<{ success: true }>(`/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
      });
      setTasks((previous) => previous.filter((task) => task.id !== selectedTask.id));
      setTaskNote("");
      setTaskProjectId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to clear selected box.");
    } finally {
      setSavingTask(false);
    }
  }, [fetchJSON, selectedTask]);

  useEffect(() => {
    if (tab !== "planner" || isTaskEditorOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextEntryElement(event.target)) {
        return;
      }

      const key = event.key;
      const lowerKey = key.toLowerCase();
      const hasCommand = event.metaKey || event.ctrlKey;

      if (!hasCommand && key.startsWith("Arrow")) {
        event.preventDefault();

        const currentDayIndex = weekDates.indexOf(selectedDateKey);
        const safeDayIndex = currentDayIndex >= 0 ? currentDayIndex : 0;

        if (key === "ArrowUp") {
          setSelectedHour((previous) => Math.max(0, previous - 1));
          return;
        }

        if (key === "ArrowDown") {
          setSelectedHour((previous) => Math.min(23, previous + 1));
          return;
        }

        if (key === "ArrowLeft") {
          const nextIndex = Math.max(0, safeDayIndex - 1);
          const nextDateKey = weekDates[nextIndex];
          setSelectedDateKey(nextDateKey);
          setReflectionFocusDateKey(nextDateKey);
          return;
        }

        if (key === "ArrowRight") {
          const nextIndex = Math.min(weekDates.length - 1, safeDayIndex + 1);
          const nextDateKey = weekDates[nextIndex];
          setSelectedDateKey(nextDateKey);
          setReflectionFocusDateKey(nextDateKey);
          return;
        }
      }

      if (!hasCommand && key === "Enter") {
        event.preventDefault();
        setIsTaskEditorOpen(true);
        return;
      }

      if (!hasCommand && (key === "Delete" || key === "Backspace")) {
        event.preventDefault();
        void clearSelectedCellTask();
        return;
      }

      if (hasCommand && lowerKey === "c") {
        event.preventDefault();
        copySelectedCellTask();
        return;
      }

      if (hasCommand && lowerKey === "v") {
        event.preventDefault();
        void pasteToSelectedCell();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    clearSelectedCellTask,
    copySelectedCellTask,
    isTaskEditorOpen,
    pasteToSelectedCell,
    selectedDateKey,
    tab,
    weekDates,
  ]);

  useEffect(() => {
    if (tab !== "planner") {
      return;
    }

    const cellKey = `${selectedDateKey}-${selectedHour}`;
    const selectedCell = cellRefs.current[cellKey];
    if (!selectedCell) {
      return;
    }

    // Follow selection both vertically (page) and horizontally (grid container).
    selectedCell.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });

    const scroller = gridScrollerRef.current;
    if (!scroller) {
      return;
    }

    const scrollerRect = scroller.getBoundingClientRect();
    const cellRect = selectedCell.getBoundingClientRect();
    const horizontalPadding = 20;

    if (cellRect.left < scrollerRect.left + horizontalPadding) {
      scroller.scrollBy({
        left: cellRect.left - scrollerRect.left - horizontalPadding,
        behavior: "smooth",
      });
      return;
    }

    if (cellRect.right > scrollerRect.right - horizontalPadding) {
      scroller.scrollBy({
        left: cellRect.right - scrollerRect.right + horizontalPadding,
        behavior: "smooth",
      });
    }
  }, [selectedDateKey, selectedHour, tab]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-3 py-4 md:px-6">
      <header className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">KaizenNote</h1>
            <p className="text-sm text-muted-foreground">
              Weekly planner and reflection workspace.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{username}</span>
          </div>
        </div>

        <nav className="mt-4 flex flex-wrap gap-2">
          {(["planner", "dashboard", "settings", "profile"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                if (item === "dashboard") {
                  void loadReports();
                }
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                tab === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:opacity-80"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {tab === "planner" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3">
            <div className="text-sm font-medium">
              Week: {formatDateLabel(weekStart)} - {formatDateLabel(shiftDateKey(weekStart, 6))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekStart((previous) => shiftDateKey(previous, -7))}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(startOfWeekDateKey())}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Current
              </button>
              <button
                type="button"
                onClick={() => setWeekStart((previous) => shiftDateKey(previous, 7))}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Next
              </button>
            </div>
          </div>

          <div
            ref={gridScrollerRef}
            className="overflow-x-auto rounded-xl border border-border bg-card"
          >
            <table className="min-w-[980px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-16 border-b border-r border-border bg-card px-2 py-2 text-left">
                    Hour
                  </th>
                  {weekDates.map((dateKey) => (
                    <th key={dateKey} className="w-[130px] border-b border-border px-1 py-2">
                      {formatDateLabel(dateKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour}>
                    <td className="sticky left-0 z-10 border-r border-border bg-card px-2 py-2 font-medium">
                      {formatHour(hour)}
                    </td>
                    {weekDates.map((dateKey) => {
                      const task = taskByCell.get(`${dateKey}-${hour}`);
                      const activity = task
                        ? activities.find((item) => item.id === task.activityTypeId)
                        : null;
                      const active = selectedDateKey === dateKey && selectedHour === hour;
                      return (
                        <td key={`${dateKey}-${hour}`} className="border border-border p-1">
                          <button
                            ref={(element) => {
                              cellRefs.current[`${dateKey}-${hour}`] = element;
                            }}
                            type="button"
                            onClick={() => {
                              setSelectedDateKey(dateKey);
                              setSelectedHour(hour);
                              setReflectionFocusDateKey(dateKey);
                            }}
                            className={`h-14 w-full rounded-md border p-1 text-left transition ${
                              active
                                ? "border-primary ring-2 ring-primary/40"
                                : "border-transparent hover:border-border"
                            }`}
                            style={{
                              backgroundColor: activity
                                ? withAlpha(activity.color, 0.2)
                                : "transparent",
                            }}
                          >
                            <p className="truncate text-[11px] font-medium">
                              {activity?.name ?? ""}
                            </p>
                            <p className="line-clamp-2 text-[11px] text-muted-foreground">
                              {task?.note ?? ""}
                            </p>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Daily Reflection</h2>
                <p className="text-xs text-muted-foreground">
                  3-day focus: Yesterday, Today, Tomorrow
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReflectionFocusDateKey((previous) => shiftDateKey(previous, -1))
                  }
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  Previous day
                </button>
                <button
                  type="button"
                  onClick={() => setReflectionFocusDateKey(todayDateKey)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReflectionFocusDateKey((previous) => shiftDateKey(previous, 1))
                  }
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  Next day
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto pb-2">
              <div
                className="mx-auto grid min-w-[980px] grid-cols-3 gap-5 px-1"
                style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
              >
                {reflectionCarouselDates.map((dateKey, index) => {
                  const draft = reflectionDrafts[dateKey] ?? {
                    plan: "",
                    result: "",
                    improvement: "",
                  };
                  const isSaving = savingReflection === dateKey;
                  const isCenter = index === 1;
                  const isToday = dateKey === todayDateKey;
                  const positionLabel =
                    index === 0 ? "Yesterday" : index === 1 ? "Today" : "Tomorrow";
                  const transform = isCenter
                    ? "scale(1)"
                    : index === 0
                      ? "translateY(8px) translateZ(-12px) rotateY(8deg) scale(0.95)"
                      : "translateY(8px) translateZ(-12px) rotateY(-8deg) scale(0.95)";

                  return (
                    <div
                      key={dateKey}
                      className={`rounded-xl border p-3 transition-all duration-300 ${
                        isCenter
                          ? "border-primary/45 bg-card shadow-[0_22px_55px_-28px_rgba(30,64,175,0.8)]"
                          : "border-border/60 bg-muted/35 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.55)]"
                      }`}
                      style={{
                        transform,
                        transformStyle: "preserve-3d",
                        opacity: isCenter ? 1 : 0.7,
                        zIndex: isCenter ? 20 : 10,
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3
                          className={`font-semibold ${
                            isCenter ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {formatDateLabel(dateKey)}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            isCenter
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCenter ? (isToday ? "Today" : "Focus Day") : positionLabel}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={5}
                          value={draft.plan}
                          onChange={(event) =>
                            setReflectionDrafts((previous) => ({
                              ...previous,
                              [dateKey]: {
                                ...draft,
                                plan: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Plan..."
                        />
                        <textarea
                          rows={5}
                          value={draft.result}
                          onChange={(event) =>
                            setReflectionDrafts((previous) => ({
                              ...previous,
                              [dateKey]: {
                                ...draft,
                                result: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Result..."
                        />
                        <textarea
                          rows={5}
                          value={draft.improvement}
                          onChange={(event) =>
                            setReflectionDrafts((previous) => ({
                              ...previous,
                              [dateKey]: {
                                ...draft,
                                improvement: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Improvement..."
                        />
                        <button
                          type="button"
                          onClick={() => void saveReflection(dateKey)}
                          disabled={isSaving}
                          className={`rounded-md px-2 py-1 text-xs font-medium disabled:opacity-60 ${
                            isCenter
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {isSaving ? "Saving..." : "Save reflection"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {tab === "dashboard" ? (
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold">Reports</h2>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="space-y-1">
                <span className="block text-xs text-muted-foreground">Start</span>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(event) => setReportStartDate(event.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <label className="space-y-1">
                <span className="block text-xs text-muted-foreground">End</span>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(event) => setReportEndDate(event.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <button
                type="button"
                onClick={() => void loadReports()}
                disabled={reportsLoading}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {reportsLoading ? "Loading..." : "Refresh reports"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold">Time by Activity</h3>
              <div className="mt-3 space-y-2">
                {activityReport.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data in this range.</p>
                ) : (
                  activityReport.map((item) => (
                    <div key={item.activityTypeId}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{item.name}</span>
                        <span>
                          {item.hours}h ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold">Time by Project</h3>
              <div className="mt-3 space-y-2">
                {projectReport.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data in this range.</p>
                ) : (
                  projectReport.map((item, index) => (
                    <div key={`${item.projectId ?? "none"}-${index}`}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{item.name}</span>
                        <span>
                          {item.hours}h ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">Weekly Day Totals</h3>
                {weeklyDayTotals.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {weeklyChartStats.totalHours}h this week
                  </p>
                ) : null}
              </div>
              <div className="mt-3">
                {weeklyDayTotals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No weekly data.</p>
                ) : (
                  <div className="rounded-xl border border-border/70 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Peak:{" "}
                        {weeklyChartStats.busiestDay
                          ? `${formatDateLabel(weeklyChartStats.busiestDay.dateKey)}`
                          : "-"}
                      </span>
                      <span>{weeklyChartStats.maxHours}h max</span>
                    </div>
                    <div className="flex h-52 items-end gap-2">
                      {weeklyDayTotals.map((item) => {
                        const ratio = item.hours / weeklyChartStats.maxHours;
                        const barHeight = Math.max(10, Math.round(ratio * 100));
                        return (
                          <div key={item.dateKey} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                            <div className="flex h-40 w-full items-end rounded-md bg-slate-100/80 p-1">
                              <div
                                className="w-full rounded-md bg-gradient-to-t from-indigo-600 via-blue-500 to-cyan-300 shadow-[0_8px_20px_-10px_rgba(37,99,235,0.9)] transition-all duration-300"
                                style={{ height: `${barHeight}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {formatShortWeekday(item.dateKey)}
                            </span>
                            <span className="text-xs font-semibold">{item.hours}h</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">8-Week Trends</h3>
                {trendItems.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Latest: {trendItems[trendItems.length - 1]?.hours ?? 0}h
                  </p>
                ) : null}
              </div>
              <div className="mt-3">
                {trendItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No trend data.</p>
                ) : (
                  <div className="rounded-xl border border-border/70 bg-gradient-to-br from-slate-50 via-white to-violet-50 p-4">
                    <svg
                      viewBox={`0 0 ${trendChart.width} ${trendChart.height}`}
                      className="h-56 w-full"
                      role="img"
                      aria-label="8-week trend chart"
                    >
                      <defs>
                        <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.04" />
                        </linearGradient>
                      </defs>

                      {trendChart.gridValues.map((value) => {
                        const y =
                          trendChart.baseline -
                          (value / Math.max(trendChart.maxValue, 1)) *
                            (trendChart.baseline - trendChart.padding);
                        return (
                          <g key={`grid-${value}`}>
                            <line
                              x1={trendChart.padding}
                              y1={y}
                              x2={trendChart.width - trendChart.padding}
                              y2={y}
                              stroke="#cbd5e1"
                              strokeDasharray="4 6"
                              strokeWidth="1"
                            />
                            <text
                              x={8}
                              y={y + 4}
                              fontSize="10"
                              fill="#64748b"
                            >
                              {value}h
                            </text>
                          </g>
                        );
                      })}

                      {trendChart.areaPath ? (
                        <path d={trendChart.areaPath} fill="url(#trendAreaGradient)" />
                      ) : null}
                      {trendChart.linePath ? (
                        <path
                          d={trendChart.linePath}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : null}

                      {trendChart.points.map((point) => (
                        <g key={point.item.weekStart}>
                          <circle cx={point.x} cy={point.y} r="4.5" fill="#2563eb" />
                          <circle cx={point.x} cy={point.y} r="9" fill="#2563eb" opacity="0.16" />
                        </g>
                      ))}
                    </svg>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {trendItems.map((item, index) => {
                        if (index % 2 !== 0 && index !== trendItems.length - 1) {
                          return null;
                        }
                        return (
                          <div
                            key={`label-${item.weekStart}`}
                            className="rounded-md border border-border/70 bg-white/80 px-2 py-1 text-[11px]"
                          >
                            <p className="font-medium text-foreground">
                              {formatMonthDay(item.weekStart)}
                            </p>
                            <p className="text-muted-foreground">{item.hours}h</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {tab === "settings" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold">Activity Types</h2>

            <div className="mt-3 flex flex-wrap gap-2">
              <input
                value={newActivityName}
                onChange={(event) => setNewActivityName(event.target.value)}
                placeholder="New activity name"
                className="min-w-[180px] flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="color"
                value={newActivityColor}
                onChange={(event) => setNewActivityColor(event.target.value)}
                className="h-10 w-14 rounded-md border border-input bg-background p-1"
              />
              <button
                type="button"
                onClick={() => void createActivity()}
                disabled={settingsBusy}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-md border border-border p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={activity.name}
                      onChange={(event) =>
                        setActivities((previous) =>
                          previous.map((item) =>
                            item.id === activity.id
                              ? { ...item, name: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="min-w-[160px] flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="color"
                      value={activity.color}
                      onChange={(event) =>
                        setActivities((previous) =>
                          previous.map((item) =>
                            item.id === activity.id
                              ? { ...item, color: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="h-9 w-12 rounded-md border border-input p-1"
                    />
                    <button
                      type="button"
                      onClick={() => void updateActivity(activity)}
                      disabled={settingsBusy}
                      className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteActivity(activity.id)}
                      disabled={settingsBusy}
                      className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold">Projects</h2>

            <div className="mt-3 space-y-2">
              <input
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                placeholder="New project name"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                value={newProjectDescription}
                onChange={(event) => setNewProjectDescription(event.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={(event) => setNewProjectColor(event.target.value)}
                  className="h-10 w-14 rounded-md border border-input bg-background p-1"
                />
                <button
                  type="button"
                  onClick={() => void createProject()}
                  disabled={settingsBusy}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  Add project
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {projects.map((project) => (
                <div key={project.id} className="rounded-md border border-border p-2">
                  <div className="space-y-2">
                    <input
                      value={project.name}
                      onChange={(event) =>
                        setProjects((previous) =>
                          previous.map((item) =>
                            item.id === project.id
                              ? { ...item, name: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      value={project.description ?? ""}
                      onChange={(event) =>
                        setProjects((previous) =>
                          previous.map((item) =>
                            item.id === project.id
                              ? { ...item, description: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={project.color}
                        onChange={(event) =>
                          setProjects((previous) =>
                            previous.map((item) =>
                              item.id === project.id
                                ? { ...item, color: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="h-9 w-12 rounded-md border border-input p-1"
                      />
                      <button
                        type="button"
                        onClick={() => void updateProject(project)}
                        disabled={settingsBusy}
                        className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteProject(project.id)}
                        disabled={settingsBusy}
                        className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {tab === "profile" ? (
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">Username: {username}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 rounded-md border border-destructive px-3 py-2 text-sm text-destructive"
          >
            Logout
          </button>
        </section>
      ) : null}

      {tab === "planner" && isTaskEditorOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3"
          onClick={() => setIsTaskEditorOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-border bg-card p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Edit Time Block</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDateLabel(selectedDateKey)} at {formatHour(selectedHour)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTaskEditorOpen(false)}
                className="rounded-md border border-border px-2 py-1 text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Task note</span>
                <textarea
                  rows={4}
                  value={taskNote}
                  onChange={(event) => {
                    setTaskEditorTouched(true);
                    setTaskNote(event.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe this time block..."
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Activity type</span>
                <select
                  value={taskActivityTypeId}
                  onChange={(event) => {
                    setTaskEditorTouched(true);
                    setTaskActivityTypeId(event.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select activity</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Project (optional)</span>
                <select
                  value={taskProjectId}
                  onChange={(event) => {
                    setTaskEditorTouched(true);
                    setTaskProjectId(event.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void saveTask()}
                    disabled={savingTask || loading || activities.length === 0}
                    className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                  >
                    {savingTask ? "Saving..." : "Save task"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteTask()}
                    disabled={savingTask || !selectedTask}
                    className="rounded-md border border-destructive px-3 py-2 text-sm text-destructive disabled:opacity-60"
                  >
                    Delete task
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyTaskToClipboard}
                    disabled={savingTask || activities.length === 0}
                    className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
                  >
                    {copyFeedback || "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={pasteTaskFromClipboard}
                    disabled={!taskClipboard}
                    className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
                  >
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Loading data...
        </div>
      ) : null}
    </main>
  );
}
