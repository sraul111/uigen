import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallMessage } from "../ToolCallMessage";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("shows 'Creating' while str_replace_editor create is in progress", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Created' once str_replace_editor create has a result", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "File created",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Created /App.jsx")).toBeDefined();
});

test("shows 'Editing'/'Edited' for str_replace command", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx" },
    state: "call",
  };
  const { rerender } = render(<ToolCallMessage toolInvocation={inProgress} />);
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  rerender(<ToolCallMessage toolInvocation={done} />);
  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
});

test("shows 'Editing'/'Edited' for insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
});

test("shows 'Viewing'/'Viewed' for view command", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "call",
  };
  const { rerender } = render(<ToolCallMessage toolInvocation={inProgress} />);
  expect(screen.getByText("Viewing /App.jsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "file contents",
  };
  rerender(<ToolCallMessage toolInvocation={done} />);
  expect(screen.getByText("Viewed /App.jsx")).toBeDefined();
});

test("shows 'Renaming'/'Renamed' for file_manager rename command", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
    state: "call",
  };
  const { rerender } = render(<ToolCallMessage toolInvocation={inProgress} />);
  expect(screen.getByText("Renaming /old.jsx to /new.jsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
    state: "result",
    result: { success: true, message: "Successfully renamed" },
  };
  rerender(<ToolCallMessage toolInvocation={done} />);
  expect(screen.getByText("Renamed /old.jsx to /new.jsx")).toBeDefined();
});

test("shows 'Deleting'/'Deleted' for file_manager delete command", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/App.jsx" },
    state: "call",
  };
  const { rerender } = render(<ToolCallMessage toolInvocation={inProgress} />);
  expect(screen.getByText("Deleting /App.jsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/App.jsx" },
    state: "result",
    result: { success: true, message: "Successfully deleted" },
  };
  rerender(<ToolCallMessage toolInvocation={done} />);
  expect(screen.getByText("Deleted /App.jsx")).toBeDefined();
});

test("falls back to the raw tool name for an unrecognized tool", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "some_other_tool",
    args: {},
    state: "call",
  } as unknown as ToolInvocation;

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("shows a spinner while in progress and a status dot once done", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };
  const { container, rerender } = render(
    <ToolCallMessage toolInvocation={inProgress} />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  rerender(<ToolCallMessage toolInvocation={done} />);
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
});
