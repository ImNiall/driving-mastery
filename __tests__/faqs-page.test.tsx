import React from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FaqsPage from "@/app/faqs/page";
import { FAQ_SECTIONS } from "@/content/faqs";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch: _prefetch,
    ...rest
  }: {
    href: string;
    children: ReactNode;
    prefetch?: boolean;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
});

describe("FaqsPage", () => {
  test("accordion toggles reveal answers and guarantee link", async () => {
    const user = userEvent.setup();
    render(<FaqsPage />);

    const question = "How do I create an account?";
    const toggle = screen.getByRole("button", { name: question });
    const panel = screen.getByRole("region", { name: question });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(panel.className).toContain("grid-rows-[0fr]");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(panel.className).toContain("grid-rows-[1fr]");
    expect(
      within(panel).getByText(/Visit drivingmastery.co.uk/i),
    ).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const guaranteeToggle = screen.getByRole("button", {
      name: "What is the Pass Guarantee?",
    });
    await user.click(guaranteeToggle);
    const guaranteePanel = screen.getByRole("region", {
      name: "What is the Pass Guarantee?",
    });
    const termsLink = within(guaranteePanel).getByRole("link", {
      name: "Terms apply",
    });
    expect(termsLink).toHaveAttribute("href", "#");
  });

  test("search filters FAQs by keyword", async () => {
    const user = userEvent.setup();
    render(<FaqsPage />);

    const input = screen.getByRole("searchbox", { name: /search questions/i });
    await user.type(input, "hazard");

    expect(
      await screen.findByRole("button", {
        name: "How does hazard perception training work?",
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Getting Started" }),
      ).not.toBeInTheDocument();
    });
  });

  test("renders FAQPage JSON-LD schema", () => {
    render(<FaqsPage />);

    const script = screen.getByTestId("faq-json-ld");
    expect(script).toHaveAttribute("type", "application/ld+json");

    const data = JSON.parse(script.textContent ?? "{}");
    expect(data["@type"]).toBe("FAQPage");

    const totalItems = FAQ_SECTIONS.reduce(
      (count, section) => count + section.items.length,
      0,
    );
    expect(data.mainEntity).toHaveLength(totalItems);
    expect(
      data.mainEntity.some((entry: { acceptedAnswer?: { text?: string } }) =>
        entry.acceptedAnswer?.text?.includes("(#)"),
      ),
    ).toBe(false);
  });
});
