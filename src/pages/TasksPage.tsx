// src/pages/TasksPage.tsx
import React from "react";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes tâches</h1>
      <TaskList />
    </div>
  );
}
