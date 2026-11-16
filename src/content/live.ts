/**
 * Real Conductor UI, running in the reader's browser.
 *
 * public/live/conductor/ is a production build of capstone-team-1 app/frontend at
 * development @ 9893400a (PR #946), unmodified. tools/conductor-live/mock-backend.js
 * is loaded ahead of it and answers its API calls with mock data, so no Kong,
 * Canvas, or model provider is involved. The clips in public/conductor/motion/
 * were recorded from that same build with Playwright (tools/conductor-live/).
 */

export const LIVE_SOURCE = "capstone-team-1 · development @ 9893400a (PR #946)";
export const LIVE_ENTRY = "/live/conductor/index.html";

export type LiveRoute = { label: string; route: string };

export const liveRoutes: LiveRoute[] = [
  { label: "Dashboard", route: "/dashboard" },
  { label: "Courses", route: "/courses" },
  { label: "AI Assistant", route: "/ai-assistant" },
  { label: "Action History", route: "/action-history" },
];

export function liveUrl(route: string, theme: "light" | "dark"): string {
  const params = new URLSearchParams({ route, theme });
  return `${LIVE_ENTRY}?${params.toString()}`;
}

export type Clip = {
  id: string;
  label: string;
  title: string;
  caption: string;
  alt: string;
  webm: string;
  gif: string;
  poster: string;
  /** Width / height of the recording, for layout before the media loads. */
  ratio: string;
};

const motion = (name: string) => ({
  webm: `/conductor/motion/${name}.webm`,
  gif: `/conductor/motion/${name}.gif`,
  poster: `/conductor/motion/${name}-poster.png`,
});

export const clips: Clip[] = [
  {
    id: "agent-think",
    label: "AGENT · THINK + TOOLS",
    title: "The agent thinks, calls three tools, and answers",
    caption:
      "Real Conductor UI with mock data. The “Agent is thinking …” shimmer runs while the session polls; the answer types in, and “Used 3 tools” opens to List My Courses, List Course Assignments, and Get Submission Status, each Succeeded. About 4 s of waiting is cut.",
    alt: "Conductor AI Assistant: an instructor asks which COSC 360 assignments need grading, the agent shows a thinking shimmer, types an answer, and the stacked tool icons expand into three succeeded tool calls",
    ratio: "888 / 722",
    ...motion("agent-think"),
  },
  {
    id: "agent-review",
    label: "AGENT · HUMAN REVIEW",
    title: "A write waits for the instructor",
    caption:
      "Real Conductor UI with mock data. A request to post an announcement pauses on create_announcement; the Review Drafted Announcement panel opens, the instructor presses Send Announcement, and the tool turns Approved. The demo backend writes nothing to Canvas. About 11 s of waiting is cut.",
    alt: "Conductor AI Assistant drafting a COSC 360 announcement, opening the human-in-the-loop review panel, and marking the announcement approved",
    ratio: "888 / 722",
    ...motion("agent-review"),
  },
  {
    id: "assistant-greeting",
    label: "ASSISTANT · GREETING",
    title: "“How can I help you with your courses?”",
    caption:
      "The AI Assistant empty state, recorded live: DiaText reveals the question once, then TextWordCarousel cycles courses → assignments → messages → quizzes → announcements. Course chips come from mock Canvas data.",
    alt: "Conductor AI Assistant greeting revealing “How can I help you with your courses?” and cycling the last word",
    ratio: "888 / 330",
    ...motion("assistant-greeting"),
  },
  {
    id: "theme-toggle",
    label: "THEME · LIGHT ↔ DARK",
    title: "Conductor’s own theme switch",
    caption:
      "The dashboard’s ThemeToggle, clicked twice. ThemeContext puts the dark class on <html> and stores canvas-ai-theme in localStorage. Mock data.",
    alt: "Conductor dashboard switching from light to dark mode and back with the sun and moon toggle",
    ratio: "1280 / 800",
    ...motion("theme-toggle"),
  },
  {
    id: "desk-tour",
    label: "NAVIGATION · THE RAIL",
    title: "Walking the instructor rooms",
    caption:
      "Courses, Grading Queue, Action History, AI Assistant, then back to the Dashboard, through the real left rail. Mock data.",
    alt: "Conductor navigating from the dashboard to courses, grading queue, action history, and the AI assistant",
    ratio: "1280 / 800",
    ...motion("desk-tour"),
  },
];

export function clipById(id: string): Clip | undefined {
  return clips.find((clip) => clip.id === id);
}
