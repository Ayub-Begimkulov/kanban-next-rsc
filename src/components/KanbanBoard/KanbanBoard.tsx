import { Task, TaskStatus, getTasks } from "@/server-actions/tasks";

const styles = {
  wrapper: {
    display: "flex",
    flexWrap: "nowrap",
    gap: 24,
    width: "100%",
    height: "100%",
  },
  column: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
  },
  columnInner: {
    marginTop: 12,
    border: "1px solid lightgrey",
    borderRadius: 8,
    flex: 1,
    padding: 8,
  },
  card: {
    border: "1px solid lightgrey",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    cursor: "pointer",
  },
} satisfies Record<string, React.CSSProperties>;

const columns: { title: string; status: TaskStatus }[] = [
  {
    title: "Backlog",
    status: "backlog",
  },
  {
    title: "In Progress",
    status: "in-progress",
  },
  {
    title: "Review",
    status: "review",
  },
  {
    title: "Done",
    status: "done",
  },
];

export async function KanbanBoard() {
  const tasks = await getTasks();

  const statusToTasksMap = tasks.reduce((acc: Record<string, Task[]>, task) => {
    const tasks = acc[task.status] ?? [];
    tasks.push(task);
    acc[task.status] = tasks;
    return acc;
  }, {});

  return (
    <div style={styles.wrapper}>
      {columns.map((column) => {
        const tasksForColumn = statusToTasksMap[column.status];
        return (
          <div key={column.status} style={styles.column}>
            <h3>{column.title}</h3>
            <div style={styles.columnInner}>
              {tasksForColumn?.map((task) => (
                <div key={task.id} style={styles.card}>
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
