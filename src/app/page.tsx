import { Suspense } from "react";
import { AddTask } from "@/components/AddTask";
import { KanbanBoard } from "@/components/KanbanBoard";

/* 
- перенос задач по колонкам
- проверим добавление задачи
- редактирование задач
- проработать лоудеры и ошибки
*/

export default function Home() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: 24,
          borderBottom: "1px solid lightgrey",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>Kanban board</div>

        <AddTask>
          <button>Add Task</button>
        </AddTask>
      </header>

      <main
        style={{
          flex: 1,
          padding: 24,
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <KanbanBoard />
        </Suspense>
      </main>
    </div>
  );
}
