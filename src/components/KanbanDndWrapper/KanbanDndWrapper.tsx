"use client";

import { Task, reorderTask } from "@/server-actions/tasks";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";

interface KanbanDndWrapper {
  tasks: Task[];
  children: React.ReactNode;
}

export const KanbanDndWrapper = ({
  tasks: initialTasks,
  children,
}: KanbanDndWrapper) => {
  const [task, setTasks] = useState(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log(active, over);
    // TODO do we need this if statement
    if (!over) {
      return;
    }
    reorderTask(String(active.id), { beforeId: String(over.id) });
    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};
