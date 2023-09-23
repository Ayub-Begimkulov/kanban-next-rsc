"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task, reorderTask } from "@/server-actions/tasks";

const styles = {
  card: {
    border: "1px solid lightgrey",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    cursor: "pointer",
  },
} satisfies Record<string, React.CSSProperties>;

interface KanbanColumnSortableProps {
  tasks: Task[];
}

export const KanbanColumnSortable = ({
  tasks: initialTasks,
}: KanbanColumnSortableProps) => {
  const [tasks, setTasks] = useState(initialTasks);

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
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => {
            return (
              <SortableItem id={task.id} title={task.title} key={task.id} />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableItemProps {
  id: string;
  title: string;
}

function SortableItem({ id, title }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.card, ...style }}
      {...attributes}
      {...listeners}
    >
      {title}
    </div>
  );
}
