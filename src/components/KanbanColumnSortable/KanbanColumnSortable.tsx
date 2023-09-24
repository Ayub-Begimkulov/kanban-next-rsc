"use client";

import { useState } from "react";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "@/server-actions/tasks";

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

  return (
    <div>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => {
          return <SortableItem id={task.id} title={task.title} key={task.id} />;
        })}
      </SortableContext>
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
