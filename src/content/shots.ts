export type Shot = {
  id: string;
  src: string;
  /** Same page in Conductor's dark theme, when one was captured. */
  srcDark?: string;
  alt: string;
  caption: string;
  page: string;
};

export type WalkStep = {
  n: string;
  title: string;
  text: string;
  shot?: string;
};

const live = (name: string) => ({
  src: `/conductor/live/${name}-light.png`,
  srcDark: `/conductor/live/${name}-dark.png`,
});

/**
 * Captured from the live embed (public/live/conductor): the real frontend at
 * development @ 9893400a with the Libretto mock backend. Every course, student,
 * and count in these is mock data.
 */
export const liveShots: Shot[] = [
  {
    id: "live-dashboard",
    ...live("dashboard"),
    alt: "Conductor dashboard with mock courses COSC 360, COSC 499, and DATA 301, a grading queue card, and alerts",
    caption:
      "Dashboard with a Canvas key connected: greeting, pending submissions, course cards, the grading queue card, alerts, and quick actions. Mock data.",
    page: "/dashboard",
  },
  {
    id: "live-courses",
    ...live("courses"),
    alt: "Conductor courses page listing four mock Canvas courses",
    caption: "Courses — every Canvas section the instructor teaches, with what is left to grade. Mock data.",
    page: "/courses",
  },
  {
    id: "live-course",
    ...live("course"),
    alt: "Conductor course page for mock course COSC 360 Web Programming with average grade, marking count, and tabs",
    caption:
      "One course — average grade, submissions that need marking, and tabs for assignments, rubrics, students, calendar, gradebook history, AI permissions, and files. Mock data.",
    page: "/courses/:courseId",
  },
  {
    id: "live-assistant",
    ...live("assistant"),
    alt: "Conductor AI Assistant greeting with chat logs and course chips",
    caption:
      "AI Assistant — chat logs on the left, the greeting and course chips in the middle. Picking a course opens the composer. Mock data.",
    page: "/ai-assistant",
  },
  {
    id: "live-grading",
    ...live("grading-queue"),
    alt: "Conductor grading queue listing assignments with ungraded submissions",
    caption: "Grading Queue — closed assignments with ungraded submissions, across courses. Mock data.",
    page: "/grading-queue",
  },
  {
    id: "live-history",
    ...live("history"),
    alt: "Conductor action history with confirmed, rejected, and preview agent actions",
    caption:
      "Action History — what the assistant proposed and what the instructor decided: confirmed, rejected, still in preview. Mock data.",
    page: "/action-history",
  },
  {
    id: "live-settings",
    ...live("settings"),
    alt: "Conductor profile and settings page",
    caption: "Profile & Settings — account details, locale, and the Canvas, AI provider, and MCP access tabs. Mock data.",
    page: "/settings",
  },
];

/** Captured from development @ 9893400a (PR #946) against a rebuilt compose stack. */
export const conductorShots: Shot[] = [
  {
    id: "login",
    src: "/conductor/00-login.png",
    alt: "Conductor login desk with Canvas Intelligence brand panel and sign-in form",
    caption: "Login — the only room open before Conductor issues a JWT.",
    page: "/login",
  },
  {
    id: "dashboard",
    src: "/conductor/01-dashboard.png",
    alt: "Conductor dashboard with grading queue, quick actions, and Canvas connect prompt",
    caption:
      "Dashboard — grading queue, alerts, and quick actions. Without a Canvas key the course list asks the instructor to connect.",
    page: "/dashboard",
  },
  {
    id: "courses",
    src: "/conductor/02-courses.png",
    alt: "Conductor courses page empty until a Canvas token is connected",
    caption: "Courses — Canvas sections appear here once the instructor’s token is connected.",
    page: "/courses",
  },
  {
    id: "assistant",
    src: "/conductor/05-ai-assistant.png",
    alt: "Conductor AI Assistant prompting to connect a model provider",
    caption:
      "AI Assistant — natural language in; a reviewed Canvas plan out. Model and Canvas keys must be connected first.",
    page: "/ai-assistant",
  },
  {
    id: "history",
    src: "/conductor/06-action-history.png",
    alt: "Conductor action history with approved, pending, and denied counts",
    caption: "Action History — every assistant proposal the instructor already judged.",
    page: "/action-history",
  },
  {
    id: "settings",
    src: "/conductor/07-settings.png",
    alt: "Conductor instructor settings page",
    caption: "Settings — locale, preferences, and links to Canvas and model tokens.",
    page: "/settings",
  },
  {
    id: "canvas-token",
    src: "/conductor/08-canvas-token.png",
    alt: "Conductor Canvas token connection page",
    caption: "Canvas token — the instructor’s own LMS credential, stored by auth, used only by the connector.",
    page: "/canvas-token-connection",
  },
  {
    id: "users",
    src: "/conductor/01-user-management.png",
    alt: "Conductor admin user management page",
    caption: "User Management — who may enter Conductor, and with which role.",
    page: "/user-management",
  },
  {
    id: "health",
    src: "/conductor/02-system-health.png",
    alt: "Conductor system health live log stream for admins",
    caption: "System Health — live service logs and ERROR/FATAL health for admins.",
    page: "/system-health",
  },
];

export const conductorWalk: WalkStep[] = [
  {
    n: "01",
    title: "Sign in",
    text: "An instructor opens Conductor at the login desk. Auth issues a JWT through Kong. Until that token exists, every other room stays closed.",
    shot: "login",
  },
  {
    n: "02",
    title: "Read the dashboard",
    text: "The dashboard shows the grading queue, alerts, and quick actions (announcement, quiz, message, assignment). Without a Canvas key it asks the instructor to connect in Settings.",
    shot: "dashboard",
  },
  {
    n: "03",
    title: "Connect Canvas, then open courses",
    text: "Courses lists Canvas sections the person teaches. Connecting a token on the Canvas page is what fills that list; opening a course reveals assignments and rubrics.",
    shot: "canvas-token",
  },
  {
    n: "04",
    title: "Ask in ordinary language",
    text: "On AI Assistant the instructor connects a model (or uses the platform key), picks a course, and types a request such as moving a midterm. The agent proposes tools; it does not hold the roster.",
    shot: "assistant",
  },
  {
    n: "05",
    title: "Approve the write",
    text: "Any WRITE pauses for human-in-the-loop review. The person edits the draft, approves, or denies. Only then may the connector call Canvas.",
  },
  {
    n: "06",
    title: "Audit what happened",
    text: "Action History keeps approved, pending, and denied counts. It is the institutional memory of what Conductor was allowed to change.",
    shot: "history",
  },
  {
    n: "07",
    title: "Watch health as an admin",
    text: "Admins stay on user management and System Health (live logs). Instructors never need those rooms.",
    shot: "health",
  },
];

export function shotById(id: string): Shot | undefined {
  return conductorShots.find((shot) => shot.id === id) ?? liveShots.find((shot) => shot.id === id);
}
