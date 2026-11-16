/*
 * Conductor live-embed mock backend.
 *
 * Loaded as a classic <script> before the real Conductor bundle (capstone-team-1
 * app/frontend @ 9893400a). It answers the frontend's HTTP calls to Kong
 * (http://localhost:8000/api/...) and its notification WebSockets in the
 * browser, so the REAL React components render without the compose stack.
 *
 * Every course, student, count, and agent step here is MOCK DATA written for
 * Libretto. Nothing reaches Canvas, a model provider, or any server.
 */
(function () {
  "use strict";

  var API = "localhost:8000/api";
  var params = new URLSearchParams(window.location.search);

  // ---- Theme: let the host page pick the starting theme (?theme=dark|light).
  try {
    var t = params.get("theme");
    if (t === "dark" || t === "light") localStorage.setItem("canvas-ai-theme", t);
  } catch (e) {}

  // ---- Route: the bundle is served from /live/conductor/, but Conductor's
  // BrowserRouter expects app paths. Rewrite the URL before React boots.
  var route = params.get("route") || "/dashboard";
  if (route.charAt(0) !== "/") route = "/" + route;
  history.replaceState(null, "", route);

  // ---- Fake identity (unsigned demo JWT; jwt-decode only reads the payload).
  function b64url(obj) {
    return btoa(JSON.stringify(obj)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  var USER_ID = "demo-instructor";
  var TOKEN =
    b64url({ alg: "none", typ: "JWT" }) +
    "." +
    b64url({ sub: USER_ID, role: "Instructor", exp: 4102444800 }) +
    ".libretto-demo";
  var ME = {
    fullname: "Dr. Kisia",
    username: "kisia",
    email: "kisia@example.edu",
    active: true,
    effective_locale: "en",
    onboarding_completed: true,
  };

  // ---- Mock Canvas data.
  var now = Date.now();
  function iso(days, hours) {
    return new Date(now + days * 864e5 + (hours || 0) * 36e5).toISOString();
  }
  var COURSES = [
    { id: 3601, name: "Web Programming", course_code: "COSC 360", start_at: iso(-60), end_at: iso(40), enrollment_term_id: 1, workflow_state: "available", total_students: 142, needs_grading_count: 23 },
    { id: 4991, name: "Software Engineering Capstone", course_code: "COSC 499", start_at: iso(-60), end_at: iso(40), enrollment_term_id: 1, workflow_state: "available", total_students: 64, needs_grading_count: 12 },
    { id: 3011, name: "Data Analytics", course_code: "DATA 301", start_at: iso(-60), end_at: iso(40), enrollment_term_id: 1, workflow_state: "available", total_students: 88, needs_grading_count: 6 },
    { id: 3041, name: "Database Systems", course_code: "COSC 304", start_at: iso(-60), end_at: iso(40), enrollment_term_id: 1, workflow_state: "available", total_students: 110, needs_grading_count: 0 },
  ];
  var ASSIGNMENTS = {
    3601: [
      ["Lab 6: Responsive Layouts", 7, 10, 23],
      ["Midterm Exam", 5, 50, 0],
      ["Project Milestone 2", 12, 25, 0],
      ["Lab 5: Forms and Validation", -3, 10, 9],
    ],
    4991: [
      ["Sprint 4 Retrospective", 2, 15, 12],
      ["Peer Evaluation 2", 9, 10, 0],
      ["Design Document v2", -6, 30, 0],
    ],
    3011: [
      ["Assignment 3: Regression", 4, 20, 6],
      ["Quiz 4", 1, 5, 0],
    ],
    3041: [
      ["Lab 7: Transactions", 6, 10, 0],
      ["SQL Project", 15, 40, 0],
    ],
  };
  var aid = 50000;
  var ASSIGN_ROWS = {};
  Object.keys(ASSIGNMENTS).forEach(function (cid) {
    ASSIGN_ROWS[cid] = ASSIGNMENTS[cid].map(function (a) {
      aid += 7;
      return {
        id: aid, name: a[0], description: "<p>Mock assignment for the Libretto demo.</p>",
        due_at: iso(a[1], 23 - new Date().getHours()), lock_at: null, unlock_at: null,
        points_possible: a[2], grading_type: "points", submission_types: ["online_upload"],
        course_id: Number(cid), workflow_state: "published", needs_grading_count: a[3],
      };
    });
  });
  var FIRST = ["Maya", "Liam", "Priya", "Noah", "Sofia", "Ethan", "Aiko", "Lucas", "Zara", "Omar", "Chloe", "Diego"];
  var LAST = ["Patel", "Nguyen", "Okafor", "Martin", "Rossi", "Kim", "Singh", "Dubois", "Haddad", "Silva", "Wong", "Brown"];
  function roster(cid) {
    return FIRST.map(function (f, i) {
      return { id: cid * 100 + i, name: f + " " + LAST[(i * 5) % LAST.length], sis_user_id: "S" + (cid * 100 + i), enrollments: [{ type: "StudentEnrollment", role: "StudentEnrollment" }] };
    });
  }
  function submissions(cid) {
    var out = [];
    (ASSIGN_ROWS[cid] || []).forEach(function (a, ai) {
      var past = new Date(a.due_at).getTime() < Date.now();
      roster(cid).forEach(function (u, ui) {
        var k = (ui * 7 + ai * 3) % 10;
        var st = past ? (k < 6 ? "graded" : k < 8 ? "submitted" : k < 9 ? "late" : "missing") : (k < 3 ? "submitted" : "unsubmitted");
        out.push({ course_id: cid, assignment_id: a.id, assignment_name: a.name, user_id: u.id, user_name: u.name, status: st,
          submitted_at: st === "missing" || st === "unsubmitted" ? null : new Date(Date.now() - k * 36e5).toISOString(),
          score: st === "graded" ? Math.round(a.points_possible * (0.62 + k * 0.06)) : null });
      });
    });
    return out;
  }
  function todos() {
    var out = [];
    Object.keys(ASSIGN_ROWS).forEach(function (cid) {
      ASSIGN_ROWS[cid].forEach(function (a) {
        if (a.needs_grading_count) out.push({ type: "grading", assignment: { id: a.id, name: a.name }, quiz: null, needs_grading_count: a.needs_grading_count, course_id: Number(cid) });
      });
    });
    return out;
  }
  var HISTORY = [
    ["create_announcement", "confirmed", 3601, "Post a reminder that Lab 6 is due Friday", -0.2],
    ["update_assignment", "confirmed", 4991, "Push Sprint 4 retrospective to Thursday", -1.1],
    ["send_message", "rejected", 3011, "Message students missing Assignment 2", -1.6],
    ["create_quiz", "confirmed", 3011, "Draft a 5 question quiz on regression", -2.4],
    ["batch_change_grade", "confirmed", 3601, "Give everyone full marks on Lab 4 question 3", -3.2],
    ["create_assignment", "preview", 3041, "Create Lab 8 on indexing, 10 points", -0.05],
  ].map(function (h, i) {
    var c = COURSES.filter(function (x) { return x.id === h[2]; })[0];
    return {
      id: "hist-" + (i + 1), user_id: USER_ID, role: "Instructor", action_type: h[0], status: h[1],
      course_id: String(h[2]), course_name: c.course_code + " " + c.name, original_request: h[3],
      affected_resources: [], timestamp: iso(h[4]), reversible: h[0] === "batch_change_grade",
      reversal_unavailable_reason: null, reverted_user_ids: [],
    };
  });

  // ---- Agent session simulator (REST polling path of useAgentConversation).
  var sessions = {};
  var sid = 0;
  function courseCtx(ids) {
    return (ids || []).map(function (id) {
      var c = COURSES.filter(function (x) { return String(x.id) === String(id); })[0];
      return c ? { id: String(c.id), name: c.course_code + " " + c.name, code: c.course_code } : { id: String(id), name: "Course " + id };
    });
  }
  function pickCourse(s) {
    var ctx = s.course_context[0];
    return ctx || { id: "3601", name: "COSC 360 Web Programming", code: "COSC 360" };
  }
  // Steps are spaced just under the frontend's 2.5 s poll so each poll sees one.
  function isWriteGoal(goal) {
    return /announce|post |notify|message the class|tell the class/i.test(goal || "");
  }
  function plan(s) {
    var c = pickCourse(s);
    if (!isWriteGoal(s.goal)) {
      var rows = ASSIGN_ROWS[c.id] || ASSIGN_ROWS[3601];
      var pending = rows.filter(function (a) { return a.needs_grading_count; });
      var text =
        "Here is what still needs grading in **" + c.name + "**:\n\n" +
        (pending.length
          ? pending.map(function (a) { return "- **" + a.name + "**: " + a.needs_grading_count + " submissions waiting"; }).join("\n")
          : "- Nothing is waiting right now.") +
        "\n\nThe next deadline is **" + rows[1].name + "**. Want me to draft a reminder for it?";
      return [
        { at: 0, type: "llm_reasoning", content: { text: "Checking the instructor's courses, then the assignments and submissions in " + c.code + "." } },
        { at: 2300, type: "tool_call", content: { tool: "list_my_courses", tool_call_id: "call_1", arguments: {} } },
        { at: 4800, type: "tool_call", content: { tool: "list_course_assignments", tool_call_id: "call_2", arguments: { course_id: c.id } } },
        { at: 7300, type: "tool_call", content: { tool: "get_submission_status", tool_call_id: "call_3", arguments: { course_id: c.id } } },
        { at: 9800, type: "final_answer", content: { text: text }, final: true },
      ];
    }
    return [
      { at: 0, type: "llm_reasoning", content: { text: "Finding the course and the assignment the instructor means before drafting anything." } },
      { at: 2300, type: "tool_call", content: { tool: "list_my_courses", tool_call_id: "call_1", arguments: {} } },
      { at: 4800, type: "tool_result", content: { tool: "list_my_courses", tool_call_id: "call_1", result: { count: COURSES.length } } },
      { at: 7300, type: "tool_call", content: { tool: "list_course_assignments", tool_call_id: "call_2", arguments: { course_id: c.id } } },
      { at: 9800, type: "tool_result", content: { tool: "list_course_assignments", tool_call_id: "call_2", result: { count: 4 } } },
      { at: 12300, type: "tool_call", content: { tool: "create_announcement", tool_call_id: "call_3", arguments: {} } },
      { at: 12900, type: "hitl_pause", content: { tool: "create_announcement" }, hitl: true },
    ];
  }
  function announcement(s) {
    var c = pickCourse(s);
    return {
      title: "Midterm moved to next Wednesday",
      message:
        "Hi everyone,\nThe " + c.code + " midterm is moving back one week, to next Wednesday in our usual room.\nLab 6 is still due Friday. Office hours are unchanged.\nSee you in class.",
      course_id: c.id,
      course_name: c.name,
    };
  }
  function stepRecords(s) {
    var elapsed = Date.now() - s.t0;
    var out = [];
    s.plan.forEach(function (p, i) {
      if (p.at <= elapsed) out.push({ step_id: s.id + "-step-" + i, step_number: i + 1, step_type: p.type, content: p.content, created_at: new Date(s.t0 + p.at).toISOString() });
    });
    if (s.resolvedAt) {
      var r = Date.now() - s.resolvedAt;
      var base = s.plan.length;
      if (r >= 400) out.push({ step_id: s.id + "-step-r1", step_number: base + 1, step_type: "tool_result", content: { tool: "create_announcement", tool_call_id: "call_3", result: s.approved ? { ok: true, id: 88231 } : { status: "error", error: "Declined by instructor" } }, created_at: new Date(s.resolvedAt + 400).toISOString() });
      if (r >= 2600) out.push({ step_id: s.id + "-step-final", step_number: base + 2, step_type: "final_answer", content: { text: s.finalText }, created_at: new Date(s.resolvedAt + 2600).toISOString() });
    }
    return out;
  }
  function status(s) {
    var last = s.plan[s.plan.length - 1];
    if (last.final) return Date.now() - s.t0 >= last.at ? "completed" : "running";
    if (s.resolvedAt) return Date.now() - s.resolvedAt >= 2600 ? "completed" : "running";
    var hitlAt = s.plan[s.plan.length - 1].at;
    return Date.now() - s.t0 >= hitlAt ? "awaiting_approval" : "running";
  }
  function summary(s) {
    return { session_id: s.id, log_id: "log-" + s.id, title: s.title, goal: s.goal, status: status(s), current_step: stepRecords(s).length, created_at: new Date(s.t0).toISOString(), updated_at: new Date().toISOString(), course_context: s.course_context };
  }
  var PAST = [
    { session_id: "past-1", log_id: "log-past-1", title: "Remind COSC 360 about Lab 6", goal: "Remind COSC 360 about Lab 6", status: "completed", current_step: 6, created_at: iso(-0.3), updated_at: iso(-0.3), course_context: courseCtx([3601]) },
    { session_id: "past-2", log_id: "log-past-2", title: "Sprint 4 retro due date", goal: "Push Sprint 4 retrospective to Thursday", status: "completed", current_step: 8, created_at: iso(-1.1), updated_at: iso(-1.1), course_context: courseCtx([4991]) },
    { session_id: "past-3", log_id: "log-past-3", title: "Regression quiz draft", goal: "Draft a 5 question quiz on regression", status: "completed", current_step: 9, created_at: iso(-2.4), updated_at: iso(-2.4), course_context: courseCtx([3011]) },
  ];

  // ---- Router.
  function route_(method, path, query, body) {
    var m;
    if (path === "/auth/auth/refresh" || path === "/auth/auth/login") return [200, { access_token: TOKEN, token_type: "bearer", user_data: ME }];
    if (path === "/auth/auth/logout") return [200, { message: "ok" }];
    if (path === "/auth/users/me") return [200, ME];
    if (path === "/auth/auth/canvas/status") return [200, { connected: true, canvas_url: "https://canvas.example.edu" }];
    if (path === "/auth/auth/llm/status") return [200, { connected: true, api_base_url: "https://api.openai.com/v1", llm_model: "gpt-4o-mini", active_key_id: "key-1", provider_type: "custom" }];
    if (path === "/auth/auth/llm/keys") return [200, [{ id: "key-1", name: "Course assistant key", description: "Mock key", provider_type: "custom", api_base_url: "https://api.openai.com/v1", llm_model: "gpt-4o-mini", is_active: true, created_at: iso(-20) }]];
    if (path === "/auth/mcp-keys") return [200, []];
    if (path === "/connector/courses") return [200, COURSES];
    if ((m = path.match(/^\/connector\/courses\/(\d+)$/))) {
      var c = COURSES.filter(function (x) { return x.id === Number(m[1]); })[0] || COURSES[0];
      return [200, { course_id: c.id, course: c, roster: roster(c.id), assignments: ASSIGN_ROWS[c.id] || [] }];
    }
    if ((m = path.match(/^\/connector\/courses\/(\d+)\/assignments\/(\d+)$/))) {
      var list = ASSIGN_ROWS[m[1]] || [];
      return [200, list.filter(function (a) { return a.id === Number(m[2]); })[0] || list[0]];
    }
    if ((m = path.match(/^\/connector\/courses\/(\d+)\/(students|users|roster)/))) return [200, roster(Number(m[1]))];
    if ((m = path.match(/^\/connector\/courses\/(\d+)\/submissions$/))) return [200, submissions(Number(m[1]))];
    if (path === "/connector/analytics/todo") return [200, todos()];
    if (path === "/agent/sessions/active-running-count") {
      var running = Object.keys(sessions).filter(function (k) { return status(sessions[k]) === "running"; }).length;
      return [200, { count: running, has_running: running > 0 }];
    }
    if (path === "/agent/sessions" && method === "GET") {
      var items = Object.keys(sessions).map(function (k) { return summary(sessions[k]); }).reverse().concat(PAST);
      return [200, { items: items, total: items.length, limit: 50, offset: 0 }];
    }
    if (path === "/agent/sessions" && method === "POST") {
      var id = "demo-session-" + ++sid;
      var s = { id: id, goal: body.goal, title: body.title || body.goal.slice(0, 40), course_context: courseCtx(body.course_ids), t0: Date.now() };
      s.plan = plan(s);
      s.announcement = announcement(s);
      sessions[id] = s;
      return [200, { session_id: id, log_id: "log-" + id, status: "running", course_context: s.course_context }];
    }
    if ((m = path.match(/^\/agent\/sessions\/([^/]+)$/)) && method === "GET") {
      var ss = sessions[m[1]];
      if (!ss) {
        var p = PAST.filter(function (x) { return x.session_id === m[1]; })[0];
        return p ? [200, Object.assign({ steps: [] }, p)] : [404, { detail: "Not found" }];
      }
      return [200, Object.assign(summary(ss), { steps: stepRecords(ss) })];
    }
    if ((m = path.match(/^\/agent\/sessions\/([^/]+)\/messages$/))) {
      var s2 = sessions[m[1]];
      if (!s2) {
        var p2 = PAST.filter(function (x) { return x.session_id === m[1]; })[0];
        return [200, { session_id: m[1], messages: p2 ? [{ role: "user", content: p2.goal }, { role: "assistant", content: "Done: " + p2.goal + ". (Mock conversation written for the Libretto demo.)" }] : [] }];
      }
      var msgs = [{ role: "user", content: s2.goal }];
      var lastStep = s2.plan[s2.plan.length - 1];
      if (lastStep.final && status(s2) === "completed") msgs.push({ role: "assistant", content: lastStep.content.text });
      if (s2.resolvedAt) {
        msgs.push({ role: "review_decision", step_id: s2.id + "-step-6", hitl_type: "approval", proposed_action: "create_announcement", proposed_payload: s2.announcement, course_name: s2.announcement.course_name, resolution: s2.approved ? "approved" : "rejected" });
        if (status(s2) === "completed") msgs.push({ role: "assistant", content: s2.finalText });
      }
      return [200, { session_id: m[1], messages: msgs }];
    }
    if ((m = path.match(/^\/agent\/sessions\/([^/]+)\/resolve$/))) {
      var s3 = sessions[m[1]];
      if (s3) {
        s3.resolvedAt = Date.now();
        s3.approved = body.action === "approve" || body.action === "edit";
        if (body.edited_payload) s3.announcement = Object.assign({}, s3.announcement, body.edited_payload);
        s3.finalText = s3.approved
          ? "Posted **" + (s3.announcement.title || "the announcement") + "** to " + s3.announcement.course_name + ". (Demo only: no Canvas write happened.)"
          : "Okay, I did not post the announcement.";
      }
      return [200, { session_id: m[1], status: "running" }];
    }
    if ((m = path.match(/^\/agent\/sessions\/([^/]+)\/cancel$/))) {
      if (sessions[m[1]]) sessions[m[1]].resolvedAt = Date.now() - 99999;
      return [200, { session_id: m[1], status: "canceled" }];
    }
    if (path === "/agent/approvals/pending") {
      var s4 = sessions[query.get("session_id")];
      if (s4 && !s4.resolvedAt && status(s4) === "awaiting_approval") {
        return [200, [{ session_id: s4.id, step_id: s4.id + "-step-6", course_id: s4.announcement.course_id, proposed_action: "create_announcement", proposed_payload: s4.announcement, hitl_type: "approval", options: [] }]];
      }
      return [200, []];
    }
    if (path === "/agent/history") return [200, { items: HISTORY, total: HISTORY.length, limit: 50, offset: 0 }];
    if (path.indexOf("/notify/admin/logs/health") === 0) return [200, { services: [], window_minutes: 60 }];
    if (method === "GET") return [200, []];
    return [200, {}];
  }

  function handle(method, url, bodyText) {
    var u = new URL(url, window.location.href);
    var path = u.pathname.replace(/^\/api/, "");
    var body = {};
    if (bodyText && typeof bodyText === "string") {
      try { body = JSON.parse(bodyText); } catch (e) { body = {}; }
    }
    var res;
    try { res = route_(method.toUpperCase(), path, u.searchParams, body); } catch (e) { res = [500, { detail: String(e) }]; }
    if (window.__CONDUCTOR_MOCK_LOG__) window.__CONDUCTOR_MOCK_LOG__.push(method + " " + path + " -> " + res[0]);
    return res;
  }
  window.__CONDUCTOR_MOCK_LOG__ = [];
  function isApi(url) { return String(url).indexOf(API) !== -1; }

  // ---- XMLHttpRequest (axios uses the XHR adapter in browsers).
  var RealXHR = window.XMLHttpRequest;
  function MockXHR() {
    this._real = null;
    this.readyState = 0; this.status = 0; this.statusText = ""; this.response = null; this.responseText = "";
    this.responseType = ""; this.responseURL = ""; this.timeout = 0; this.withCredentials = false;
    this.upload = { addEventListener: function () {}, removeEventListener: function () {} };
    this._headers = {}; this._listeners = {};
    this.onreadystatechange = null; this.onload = null; this.onloadend = null; this.onerror = null; this.onabort = null; this.ontimeout = null;
  }
  MockXHR.UNSENT = 0; MockXHR.OPENED = 1; MockXHR.HEADERS_RECEIVED = 2; MockXHR.LOADING = 3; MockXHR.DONE = 4;
  MockXHR.prototype.open = function (method, url) {
    this._method = method; this._url = url;
    if (!isApi(url)) {
      var real = (this._real = new RealXHR());
      var self = this;
      ["readystatechange", "load", "loadend", "error", "abort", "timeout"].forEach(function (ev) {
        real.addEventListener(ev, function (e) {
          ["readyState", "status", "statusText", "response", "responseURL"].forEach(function (k) { self[k] = real[k]; });
          if (real.responseType === "" || real.responseType === "text") self.responseText = real.responseText;
          self._fire(ev, e);
        });
      });
      real.open.apply(real, arguments);
      return;
    }
    this.readyState = 1;
  };
  MockXHR.prototype.setRequestHeader = function (k, v) { if (this._real) return this._real.setRequestHeader(k, v); this._headers[k] = v; };
  MockXHR.prototype.getAllResponseHeaders = function () { return this._real ? this._real.getAllResponseHeaders() : "content-type: application/json\r\n"; };
  MockXHR.prototype.getResponseHeader = function (k) { return this._real ? this._real.getResponseHeader(k) : k.toLowerCase() === "content-type" ? "application/json" : null; };
  MockXHR.prototype.overrideMimeType = function () {};
  MockXHR.prototype.addEventListener = function (ev, fn) { (this._listeners[ev] = this._listeners[ev] || []).push(fn); };
  MockXHR.prototype.removeEventListener = function (ev, fn) { var l = this._listeners[ev] || []; var i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); };
  MockXHR.prototype._fire = function (ev, e) {
    var h = this["on" + ev]; if (typeof h === "function") h.call(this, e || { type: ev });
    (this._listeners[ev] || []).forEach(function (fn) { fn.call(this, e || { type: ev }); }, this);
  };
  MockXHR.prototype.abort = function () { if (this._real) return this._real.abort(); this._aborted = true; };
  MockXHR.prototype.send = function (body) {
    if (this._real) { this._real.timeout = this.timeout; this._real.withCredentials = this.withCredentials; if (this.responseType) this._real.responseType = this.responseType; return this._real.send(body); }
    var self = this;
    var res = handle(this._method, this._url, typeof body === "string" ? body : null);
    setTimeout(function () {
      if (self._aborted) return;
      self.status = res[0]; self.statusText = res[0] === 200 ? "OK" : "Error";
      self.responseURL = self._url;
      var text = JSON.stringify(res[1]);
      self.responseText = text;
      self.response = self.responseType === "json" ? res[1] : self.responseType === "blob" ? new Blob([text], { type: "application/json" }) : text;
      self.readyState = 4;
      self._fire("readystatechange"); self._fire("load"); self._fire("loadend");
    }, 60 + Math.random() * 80);
  };
  window.XMLHttpRequest = MockXHR;

  // ---- fetch (in case any code path uses it for the API).
  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input && input.url;
    if (!isApi(url)) return realFetch.apply(this, arguments);
    var res = handle((init && init.method) || "GET", url, init && typeof init.body === "string" ? init.body : null);
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(new Response(JSON.stringify(res[1]), { status: res[0], headers: { "content-type": "application/json" } })); }, 80);
    });
  };

  // ---- WebSocket: notification-service sockets open and stay quiet.
  var RealWS = window.WebSocket;
  function MockWS(url) {
    var self = this;
    this.url = url; this.readyState = 0; this.protocol = ""; this.extensions = ""; this.binaryType = "blob"; this.bufferedAmount = 0;
    this.onopen = this.onmessage = this.onclose = this.onerror = null; this._l = {};
    setTimeout(function () { if (self.readyState !== 0) return; self.readyState = 1; self._fire("open", { type: "open" }); }, 120);
  }
  MockWS.CONNECTING = 0; MockWS.OPEN = 1; MockWS.CLOSING = 2; MockWS.CLOSED = 3;
  MockWS.prototype.addEventListener = MockXHR.prototype.addEventListener;
  MockWS.prototype.removeEventListener = function (ev, fn) { var l = this._l[ev] || []; var i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); };
  MockWS.prototype.addEventListener = function (ev, fn) { (this._l[ev] = this._l[ev] || []).push(fn); };
  MockWS.prototype._fire = function (ev, e) { var h = this["on" + ev]; if (typeof h === "function") h.call(this, e); (this._l[ev] || []).forEach(function (fn) { fn.call(this, e); }, this); };
  MockWS.prototype.send = function () {};
  MockWS.prototype.close = function () { if (this.readyState === 3) return; this.readyState = 3; this._fire("close", { type: "close", code: 1000, reason: "", wasClean: true }); };
  window.WebSocket = function (url, protocols) {
    if (String(url).indexOf("localhost:8000") !== -1 || String(url).indexOf("localhost:8004") !== -1) return new MockWS(url);
    return new RealWS(url, protocols);
  };
  window.WebSocket.CONNECTING = 0; window.WebSocket.OPEN = 1; window.WebSocket.CLOSING = 2; window.WebSocket.CLOSED = 3;

  // ---- Host bridge: Libretto can drive the REAL theme toggle by message.
  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data || {};
    if (data.type !== "conductor:set-theme") return;
    var isDark = document.documentElement.classList.contains("dark");
    if ((data.theme === "dark") === isDark) return;
    var btn = document.querySelector("button.theme-toggle");
    if (btn) btn.click();
  });
  function report() {
    try {
      window.parent.postMessage({ type: "conductor:theme", theme: document.documentElement.classList.contains("dark") ? "dark" : "light", path: window.location.pathname }, window.location.origin);
    } catch (e) {}
  }
  new MutationObserver(report).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("load", report);
  var lastPath = "";
  setInterval(function () { if (location.pathname !== lastPath) { lastPath = location.pathname; report(); } }, 400);
})();
