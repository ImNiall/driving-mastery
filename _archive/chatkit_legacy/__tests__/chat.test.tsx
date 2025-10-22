import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ChatLanding from "@/components/chat/ChatLanding";
import ChatConversation from "@/components/chat/ChatConversation";
import Sidebar from "@/components/chat/Sidebar";
import {
  chatStoreStorageKey,
  resetChatStore,
  useChatStore,
} from "@/store/chatStore";
import type { ChatThread } from "@/types/chat";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockAssistantResponse = vi.fn(async () => "(test) response");

vi.mock("@/lib/chat/assistant", () => ({
  getAssistantResponse: (...args: unknown[]) => mockAssistantResponse(...args),
}));

describe("Chat experience", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockReplace.mockReset();
    mockAssistantResponse.mockClear();
    resetChatStore();
    window.localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  test("landing page renders actions and starts new chat", async () => {
    render(<ChatLanding />);

    expect(
      screen.getByRole("heading", { name: /how may i assist/i }),
    ).toBeInTheDocument();

    const quickAction = await screen.findByRole("button", {
      name: /Explain/i,
    });

    const user = userEvent.setup();
    await user.click(quickAction);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush.mock.calls[0][0]).toMatch(/^\/chat\/thread-/);

    const input = screen.getByLabelText(/message chat a\.i\+/i);
    await user.type(input, "Test seed");
    await user.keyboard("{Enter}");

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush.mock.calls[1][0]).toMatch(/\?seed=Test%20seed$/);
  });

  test("conversation view sends messages and honours Shift+Enter", async () => {
    const created = useChatStore
      .getState()
      .createThread({ title: "Test thread" });

    const user = userEvent.setup();
    render(<ChatConversation threadId={created.id} />);

    const input = await screen.findByLabelText(/message chat a\.i\+/i);

    await user.type(input, "First line");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    expect((input as HTMLTextAreaElement).value).toContain("First line\n");

    await user.type(input, "Final line");
    await user.keyboard("{Enter}");

    await waitFor(() => expect(mockAssistantResponse).toHaveBeenCalled());

    const matches = await screen.findAllByText("(test) response");
    expect(matches.length).toBeGreaterThan(0);
    expect((input as HTMLTextAreaElement).value).toBe("");
  });

  test("sidebar search filters conversations with debounce", async () => {
    const threads: ChatThread[] = [
      {
        id: "thread-one",
        title: "Theory revision",
        messages: [],
        updatedAt: new Date().toISOString(),
      },
      {
        id: "thread-two",
        title: "Hazard practice",
        messages: [],
        updatedAt: new Date().toISOString(),
      },
    ];

    const onSelect = vi.fn();
    const onNew = vi.fn();
    const onDelete = vi.fn();

    render(
      <Sidebar
        threads={threads}
        activeThreadId={null}
        onSelectThread={onSelect}
        onNewThread={onNew}
        onDeleteThread={onDelete}
        isOpen
        onClose={() => undefined}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/search conversations/i);
    const user = userEvent.setup({ delay: null });
    await user.type(searchInput, "hazard");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    await waitFor(() => {
      expect(screen.getByText(/Hazard practice/i)).toBeInTheDocument();
      expect(screen.queryByText(/Theory revision/i)).not.toBeInTheDocument();
    });
  });

  test("threads persist to local storage", async () => {
    const created = useChatStore
      .getState()
      .createThread({ title: "Persist me" });

    const stored = window.localStorage.getItem(chatStoreStorageKey);
    expect(stored).toBeTruthy();

    vi.resetModules();
    const refreshedStoreModule = await import("@/store/chatStore");
    const freshStore = refreshedStoreModule.useChatStore as typeof useChatStore;

    const threads = freshStore.getState().threads;
    expect(threads.some((thread) => thread.id === created.id)).toBe(true);
  });
});
