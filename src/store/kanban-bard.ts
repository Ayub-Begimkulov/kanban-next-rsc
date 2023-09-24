import { createContext, useContext } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Task } from "@/server-actions/tasks";

interface KanbanStoreData {
  tasks: Task[];

  addTasksOptimistic(options: Omit<Task, "id"> & { tempId: string }): void;
  saveTaskOptimistic(options: Task & { tempId: string }): void;
  deleteTaskOptimistic(options: { tempId: string }): void;

  reorderTasks(options: {
    id: string;
    beforeId?: string;
    afterId: string;
  }): void;
}

export function createKanbanStore(initialTasks: Task[]) {
  const useStore = create<KanbanStoreData>()(
    devtools(
      immer((set) => ({
        tasks: initialTasks,

        addTasksOptimistic(tempTaskData) {
          set((state) => {
            state.tasks.push({ ...tempTaskData, id: tempTaskData.tempId });
          });
        },
        deleteTaskOptimistic({ tempId }) {
          set((state) => {
            state.tasks = state.tasks.filter((task) => task.id !== tempId);
          });
        },
        saveTaskOptimistic({ tempId, ...savedTask }) {
          set((state) => {
            state.tasks = state.tasks.map((task) => {
              if (task.id !== tempId) {
                return task;
              }

              return savedTask;
            });
          });
        },

        reorderTasks(options) {},
      }))
    )
  );

  return useStore;
}

type KanbanStore = ReturnType<typeof createKanbanStore>;

const KanbanStoreContext = createContext<KanbanStore | null>(null);

export function useKanbanStore() {
  const useKanbanStoreHook = useContext(KanbanStoreContext);

  if (!useKanbanStoreHook) {
    throw new Error("no hook found");
  }

  return useKanbanStoreHook();
}
