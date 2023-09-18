"use client";

import { cloneElement, useState } from "react";
import { Portal } from "../Portal";
import { createTask } from "@/server-actions/tasks";

interface AddTaskProps {
  children: React.ReactElement;
}

export function AddTask({ children }: AddTaskProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleClick = () => {
    setIsOpened(true);
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  return (
    <>
      {cloneElement(children, { onClick: handleClick })}
      {isOpened && <AddTaskModal onClose={handleClose} />}
    </>
  );
}

interface AddTaskModal {
  onClose: () => void;
}

function AddTaskModal({ onClose }: AddTaskModal) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO validation
    createTask({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Portal>
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate3d(-50%, -50%, 0)",
            background: "white",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <h3>Create</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button>Create</button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
