import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import CustomChat from "@/components/chat/CustomChat";

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  public readyState = MockWebSocket.CONNECTING;
  public send = vi.fn();
  public close = vi.fn();

  public onopen: ((event: Event) => void) | null = null;
  public onmessage:
    | ((event: MessageEvent<string | ArrayBuffer>) => void)
    | null = null;
  public onerror: ((event: Event) => void) | null = null;
  public onclose: ((event: Event) => void) | null = null;

  constructor(
    public url: string,
    public protocols?: string | string[],
  ) {
    MockWebSocket.instances.push(this);
  }

  open() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  receive(payload: unknown) {
    const event = {
      data: JSON.stringify(payload),
    } as MessageEvent<string>;
    this.onmessage?.(event);
  }

  terminate() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new Event("close"));
  }
}

describe("CustomChat", () => {
  let randomUUIDSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        client_secret: "ek_test_secret",
        session: { model: "gpt-test" },
      }),
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
      randomUUIDSpy = vi
        .spyOn(globalThis.crypto, "randomUUID")
        .mockReturnValue("test-uuid");
    } else {
      vi.stubGlobal("crypto", {
        randomUUID: vi.fn(() => "test-uuid"),
      } as unknown as Crypto);
      randomUUIDSpy = null;
    }

    window.localStorage?.clear();
  });

  afterEach(() => {
    randomUUIDSpy?.mockRestore();
    randomUUIDSpy = null;
    vi.unstubAllGlobals();
  });

  it("sends user message and renders assistant reply", async () => {
    render(<CustomChat />);

    await waitFor(() =>
      expect(MockWebSocket.instances.length).toBeGreaterThan(0),
    );

    const socket = MockWebSocket.instances[0];

    await waitFor(() => typeof socket.onopen === "function");
    await act(async () => {
      socket.open();
    });

    expect(socket.url).toBe(
      `ws://${window.location.host}/api/chatkit/ws?userId=anon-test-uuid`,
    );

    await act(async () => {
      socket.receive({ type: "proxy.session", model: "gpt-test" });
    });

    const input = screen.getByPlaceholderText(
      /ask theo anything/i,
    ) as HTMLTextAreaElement;
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello Theo" } });
    await waitFor(() => expect(sendButton).not.toBeDisabled());
    fireEvent.click(sendButton);

    expect(await screen.findByText("Hello Theo")).toBeInTheDocument();
    expect(socket.send).toHaveBeenCalledWith(
      expect.stringContaining('"content":"Hello Theo"'),
    );

    await act(async () => {
      socket.receive({
        type: "message.created",
        message: {
          id: "assistant-1",
          role: "assistant",
          content: "Hi there! How can I help?",
        },
      });
      socket.receive({
        type: "message.completed",
        message_id: "assistant-1",
      });
    });

    expect(
      await screen.findByText("Hi there! How can I help?"),
    ).toBeInTheDocument();
  });
});
