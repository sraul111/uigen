"use client";

import type { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface ToolCallMessageProps {
  toolInvocation: ToolInvocation;
}

function getFriendlyMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args, state } = toolInvocation;
  const isDone = state === "result";
  const path = args?.path;

  if (toolName === "str_replace_editor" && typeof path === "string") {
    switch (args.command) {
      case "view":
        return isDone ? `Viewed ${path}` : `Viewing ${path}`;
      case "create":
        return isDone ? `Created ${path}` : `Creating ${path}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${path}` : `Editing ${path}`;
      case "undo_edit":
        return isDone ? `Undid edit on ${path}` : `Undoing edit on ${path}`;
    }
  }

  if (toolName === "file_manager" && typeof path === "string") {
    switch (args.command) {
      case "rename": {
        const newPath = args?.new_path;
        return isDone
          ? `Renamed ${path} to ${newPath}`
          : `Renaming ${path} to ${newPath}`;
      }
      case "delete":
        return isDone ? `Deleted ${path}` : `Deleting ${path}`;
    }
  }

  return toolName;
}

export function ToolCallMessage({ toolInvocation }: ToolCallMessageProps) {
  const message = getFriendlyMessage(toolInvocation);
  const isDone = toolInvocation.state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
