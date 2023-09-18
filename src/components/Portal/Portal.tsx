"use client";

import { createPortal } from "react-dom";

let modalRoot: HTMLElement | null = null;
function getModalRoot() {
  if (modalRoot) {
    return modalRoot;
  }

  modalRoot = document.getElementById("modal-root")!;

  if (!modalRoot) {
    throw new Error("modal root not found");
  }

  return modalRoot;
}

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  return createPortal(children, getModalRoot());
}
