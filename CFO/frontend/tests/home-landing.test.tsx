import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ isSignedIn: false }),
}));

vi.mock("gsap", () => ({
  gsap: { registerPlugin: vi.fn() },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

import { HomeLanding } from "../components/home/HomeLanding";

describe("HomeLanding", () => {
  it("renders product identity, value proposition, and account entry links", () => {
    const markup = renderToStaticMarkup(createElement(HomeLanding));

    expect(markup).toContain("HappyDeskAI");
    expect(markup).toContain("Make your next financial decision with confidence.");
    expect(markup).toContain('href="/sign-up"');
    expect(markup).toContain('href="/sign-in"');
  });
});
