/**
 * ─────────────────────────────────────────────
 *  REACT INTERVIEW CHALLENGE — STUDY SESSION
 *  Mid-Level | 2–4 Years Experience
 * ─────────────────────────────────────────────
 *
 * Setup:
 *   npm create vite@latest my-challenge -- --template react-ts
 *   Replace src/App.tsx with this file.
 *   npm install && npm run dev
 *
 * There are 6 challenges below. Some have bugs. Some are
 * structured poorly. Some are simply incomplete.
 * Read carefully — the problems won't announce themselves.
 *
 * Challenges:
 *   1. Counter
 *   2. User List
 *   3. Item Filter
 *   4. Task Manager
 *   5. Sibling Components
 *   6. Contact Form
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Georgia', serif",
    maxWidth: 780,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    background: "#fafaf8",
    minHeight: "100vh",
    color: "#1a1a1a",
  } as React.CSSProperties,
  h1: {
    fontSize: "1.6rem",
    borderBottom: "3px solid #1a1a1a",
    paddingBottom: "0.5rem",
    marginBottom: "2.5rem",
  } as React.CSSProperties,
  section: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "1.5rem",
    marginBottom: "2rem",
  } as React.CSSProperties,
  label: (color: string) =>
    ({
      display: "inline-block",
      fontSize: "0.7rem",
      fontFamily: "monospace",
      background: color,
      color: "#fff",
      borderRadius: 3,
      padding: "2px 7px",
      marginBottom: "0.5rem",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    }) as React.CSSProperties,
  h2: {
    fontSize: "1.1rem",
    margin: "0.25rem 0 1rem",
  } as React.CSSProperties,
  prompt: {
    fontSize: "0.85rem",
    color: "#444",
    background: "#f5f5f0",
    borderLeft: "3px solid #1a1a1a",
    padding: "0.6rem 0.8rem",
    marginBottom: "1rem",
  } as React.CSSProperties,
  btn: {
    cursor: "pointer",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.4rem 1rem",
    fontSize: "0.9rem",
    marginRight: 8,
  } as React.CSSProperties,
  outlineBtn: {
    cursor: "pointer",
    background: "transparent",
    color: "#1a1a1a",
    border: "1px solid #1a1a1a",
    borderRadius: 4,
    padding: "0.4rem 1rem",
    fontSize: "0.9rem",
    marginRight: 8,
  } as React.CSSProperties,
  input: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "0.35rem 0.6rem",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box" as const,
    marginBottom: 8,
  } as React.CSSProperties,
  meta: {
    fontSize: "0.75rem",
    color: "#888",
    fontFamily: "monospace",
    marginLeft: 8,
  } as React.CSSProperties,
};

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 1 — Counter
// ─────────────────────────────────────────────────────────────────
function Counter() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
	  setCount(previousCount => previousCount + 1);
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function handleReset() {
	  setRunning(false);
	  setCount(0);
  }

  return (
    <div>
      <p>Count: <strong>{count}</strong></p>
      <button style={s.btn} onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : "Start"}
      </button>
      <button style={s.btn} onClick={handleReset}>
		Reset
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 2 — User List
// ─────────────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

function UserList() {
	const [users, errorWithUsers, errorWithUsersMessage, loadingUsers] = useQuery<User>({query: "https://jsonplaceholder.typicode.com/users", dataType: 'user' });

  return (
    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
	  {loadingUsers && <div>Loading Users...</div>}
	  {errorWithUsers && <div>{errorWithUsersMessage}</div>}
	  {(!loadingUsers && !errorWithUsers && users) && users.map(user => <UserDisplay key={user.id} user={user} />)}
    </ul>
  );
}

interface UseQueryParams<T> {
	query: string;
	dataType: 'user';
}

function useQuery<T>({ query, dataType }: UseQueryParams<T>): [
	T | null,
	boolean, 
	string,
	boolean
] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setMessage] = useState<string>('');

  useEffect(() => {
	setLoading(true);
	setError(false);

    fetch(query)
      .then((res) => res.json())
      .then((_data) => setData(_data))
	  .catch((error) => {
		  setError(true);
		  setErrorMessage(error instanceof Error ? err.message : "Unknown Error");
	  })
	  .finally(() => setLoading(false));
  }, [query, dataType]);

  return [
	  data,
	  error,
	  errorMessage,
	  loading,
  ];
}

function UserDisplay({ user }: { user: User }) {
	return (
        <li key={user.id} style={{ marginBottom: 4 }}>
          <strong>{user.name}</strong> — {user.email}{" "}
          <span style={{ color: "#888", fontSize: "0.8rem" }}>
            ({user.company.name})
          </span>
        </li>
	)
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 3 — Item Filter
// ─────────────────────────────────────────────────────────────────
const ALL_ITEMS = [
  "Apricot", "Banana", "Blueberry", "Cherry", "Dragonfruit",
  "Elderberry", "Fig", "Grape", "Kiwi", "Lemon",
  "Mango", "Nectarine", "Orange", "Papaya", "Quince",
];

function ItemFilter() {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
      return ALL_ITEMS.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      )
  }, [query]);

  return (
    <div>
      <input
        style={s.input}
        placeholder="Filter fruits…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p style={{ margin: "0 0 6px", fontSize: "0.82rem", color: "#666" }}>
        {filteredItems.length} result(s)
      </p>
      <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 4 — Task Manager
// ─────────────────────────────────────────────────────────────────
interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: "low" | "medium" | "high";
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Review pull requests", done: false, priority: "high" },
  { id: 2, title: "Write unit tests", done: false, priority: "medium" },
  { id: 3, title: "Update README", done: true, priority: "low" },
  { id: 4, title: "Fix layout bug on mobile", done: false, priority: "high" },
  { id: 5, title: "Refactor AuthContext", done: false, priority: "medium" },
];

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  high: "#c0392b",
  medium: "#e67e22",
  low: "#27ae60",
};

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggle = useCallback((id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  ,[]);

  const remove = useCallback((id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id))
  ,[]);

  const done = tasks.filter((t) => t.done).length;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: "0.85rem" }}>
        <span>Total: {tasks.length}</span>
        <span style={{ color: "#27ae60" }}>Done: {done}</span>
        <span style={{ color: "#c0392b" }}>Remaining: {tasks.length - done}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {tasks.map((task) => <TaskDisplay key={task.id} remove={remove} task={task} toggle={toggle} />)}
      </ul>
    </div>
  );
}

interface TaskDisplayProps {
	remove: Function;
	task: Task;
	toggle: Function;
}

function TaskDisplay ({ remove, task, toggle }: TaskDisplayProps) {
	return (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              borderBottom: "1px solid #eee",
              opacity: task.done ? 0.5 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggle(task.id)}
            />
            <span style={{ flex: 1, textDecoration: task.done ? "line-through" : "none" }}>
              {task.title}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                color: PRIORITY_COLOR[task.priority],
                fontWeight: 600,
                textTransform: "uppercase",
                minWidth: 50,
              }}
            >
              {task.priority}
            </span>
            <button
              onClick={() => remove(task.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1rem" }}
            >
              ✕
            </button>
          </li>
	)
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 5 — Sibling Components
// ─────────────────────────────────────────────────────────────────
let renderCountA = 0;
let renderCountB = 0;

const PanelA = React.memo(({ label, onAction }: { label: string; onAction: () => void }) => {
  renderCountA++;
  return (
    <div style={{ padding: "8px 0" }}>
      <button style={s.outlineBtn} onClick={onAction}>{label}</button>
      <span style={s.meta}>renders: {renderCountA}</span>
    </div>
  );
})

const PanelB = React.memo(({ label, onAction }: { label: string; onAction: () => void }) => {
  renderCountB++;
  return (
    <div style={{ padding: "8px 0" }}>
      <button style={s.outlineBtn} onClick={onAction}>{label}</button>
      <span style={s.meta}>renders: {renderCountB}</span>
    </div>
  );
})

function SiblingDemo() {
  const [tick, setTick] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const tickRef = useRef(tick);

  useEffect(() => { tickRef.current = tick; }, [tick]);

  const handleA = useCallback(() => setLog((l) => [...l, `Panel A — tick ${tickRef.current}`]), []);
  const handleB = useCallback(() => setLog((l) => [...l, `Panel B — tick ${tickRef.current}`]), []);

  return (
    <div>
      <button style={s.btn} onClick={() => setTick((t) => t + 1)}>
        Re-render parent (tick: {tick})
      </button>
      <PanelA label="Trigger A" onAction={handleA} />
      <PanelB label="Trigger B" onAction={handleB} />
      {log.length > 0 && (
        <ul style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#555" }}>
          {log.slice(-4).map((entry, i) => <li key={i}>{entry}</li>)}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CHALLENGE 6 — Contact Form
// ─────────────────────────────────────────────────────────────────
function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(values.email)) errs.email = "Valid email required";
    if (values.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <p style={{ color: "#27ae60", fontWeight: 600 }}>✓ Sent!</p>;

  const field = (name: keyof typeof values, label: string, multiline = false) => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontSize: "0.85rem", marginBottom: 3 }}>{label}</label>
      {multiline ? (
        <textarea name={name} value={values[name]} onChange={handleChange} rows={3} style={{ ...s.input, resize: "vertical" }} />
      ) : (
        <input name={name} value={values[name]} onChange={handleChange} style={s.input} />
      )}
      {errors[name] && <span style={{ color: "#c0392b", fontSize: "0.78rem" }}>{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {field("name", "Name")}
      {field("email", "Email")}
      {field("message", "Message", true)}
      <button style={s.btn} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────
const challenges = [
  {
    color: "#c0392b",
    label: "Challenge 1",
    title: "Counter",
    prompt: "Start the counter. Observe its behavior over time. What's wrong? Fix it. Then add a Reset button.",
    component: <Counter />,
  },
  {
    color: "#2980b9",
    label: "Challenge 2",
    title: "User List",
    prompt: "This component fetches and renders users. What's missing for a production-ready implementation? Add it. Bonus: make the logic reusable.",
    component: <UserList />,
  },
  {
    color: "#8e44ad",
    label: "Challenge 3",
    title: "Item Filter",
    prompt: "The filter works, but something about how the state is managed is considered an anti-pattern in React. Identify it, explain why, and refactor.",
    component: <ItemFilter />,
  },
  {
    color: "#16a085",
    label: "Challenge 4",
    title: "Task Manager",
    prompt: "This component works. How would you improve its structure if this were part of a larger codebase? Refactor accordingly. Bonus: add the ability to create new tasks.",
    component: <TaskManager />,
  },
  {
    color: "#d35400",
    label: "Challenge 5",
    title: "Sibling Components",
    prompt: "Click 'Re-render parent' and watch the render counters. Is this the behavior you'd want in a real app? Investigate and fix it.",
    component: <SiblingDemo />,
  },
  {
    color: "#27ae60",
    label: "Challenge 6",
    title: "Contact Form",
    prompt: "The form is functional. What would you change about how it's organized? Refactor with reusability in mind. Bonus: make your solution work for any form shape.",
    component: <ContactForm />,
  },
];

export default function App() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>React Interview Challenges</h1>
      {challenges.map((c) => (
        <section key={c.label} style={s.section}>
          <span style={s.label(c.color)}>{c.label}</span>
          <h2 style={s.h2}>{c.title}</h2>
          <p style={s.prompt}>{c.prompt}</p>
          {c.component}
        </section>
      ))}
    </div>
  );
}
