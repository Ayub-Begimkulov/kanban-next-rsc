"use server";

import { revalidatePath } from "next/cache";
import { sleep, generateId } from "@/utils";

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

let tasks: Task[] = [
  {
    id: generateId(),
    title: "create video about next.js",
    description: "faster, faster",
    status: "backlog",
  },
  {
    id: generateId(),
    title: "edit video about next.js",
    description: "asap, asap",
    status: "backlog",
  },
  {
    id: generateId(),
    title: "buy new phone",
    description: "later",
    status: "backlog",
  },
  {
    id: generateId(),
    title: "stream",
    description: "test description",
    status: "in-progress",
  },
];

export async function getTasks() {
  await sleep(1_000);
  return tasks;
}

/* function getMaxPositionForStatus(status: TaskStatus) {
  let maxPosition = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]!;
    if (task?.status !== status) {
      continue;
    }

    maxPosition = Math.max(task.position, maxPosition);
  }
  return maxPosition;
} */

export async function createTask(data: Pick<Task, "title" | "description">) {
  const newTask: Task = {
    ...data,
    id: generateId(),
    status: "backlog",
  };
  tasks.push(newTask);

  await sleep(1_000);

  return newTask;
}

export async function updateTask(
  id: string,
  updateData: Partial<Omit<Task, "id">>
) {
  let updateTask: Task;

  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    updateTask = {
      ...task,
      ...updateData,
    };

    return updateTask;
  });

  return updateTask!;
}

export async function deleteTask(id: string) {
  tasks = tasks.filter((task) => task.id !== id);
  await sleep(1_000);
}

type ReorderTaskData =
  | { beforeId: string; newStatus?: TaskStatus }
  | { afterId: string; newStatus?: TaskStatus };

export async function reorderTask(id: string, data: ReorderTaskData) {
  const reorderedItemIndex = tasks.findIndex((task) => task.id === id);
  const taskToReorder = tasks[reorderedItemIndex];
  if (!taskToReorder) {
    return;
  }

  const [anchorId, indexOffset] =
    "beforeId" in data ? [data.beforeId, 0] : [data.afterId, 1];
  const newStatus = data.newStatus || taskToReorder.status;

  const anchorItemIndex = tasks.findIndex((task) => task.id === anchorId);
  if (anchorItemIndex === -1) {
    return;
  }

  tasks.splice(reorderedItemIndex, 1);
  tasks.splice(anchorItemIndex + indexOffset, 0, {
    ...taskToReorder,
    status: newStatus,
  });
}
