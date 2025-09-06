import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ Health Check ------------------
app.get("/", (req, res) => {
  res.json({ ok: true, service: "Campus Event Reporting API" });
});

// ------------------ Colleges ------------------
app.post("/colleges", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.run("INSERT INTO colleges (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.lastID, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/colleges", async (req, res) => {
  const rows = await db.all("SELECT * FROM colleges ORDER BY name");
  res.json(rows);
});

// ------------------ Students ------------------
app.post("/students", async (req, res) => {
  try {
    const { college_id, name, email, year } = req.body;
    const result = await db.run(
      "INSERT INTO students (college_id, name, email, year) VALUES (?, ?, ?, ?)",
      [college_id, name, email, year]
    );
    res.status(201).json({ id: result.lastID, college_id, name, email, year });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/students", async (req, res) => {
  const rows = await db.all("SELECT * FROM students ORDER BY id DESC");
  res.json(rows);
});

// ------------------ Events ------------------
app.post("/events", async (req, res) => {
  try {
    const { college_id, title, description, event_type, start_date, end_date } = req.body;
    const result = await db.run(
      "INSERT INTO events (college_id, title, description, event_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
      [college_id, title, description, event_type, start_date, end_date]
    );
    res.status(201).json({ id: result.lastID, title, event_type });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/events", async (req, res) => {
  const rows = await db.all("SELECT * FROM events ORDER BY start_date DESC");
  res.json(rows);
});

// ------------------ Reports ------------------

// Event Popularity (registrations per event, optional filter by type)
app.get("/reports/events/popularity", async (req, res) => {
  try {
    const { event_type } = req.query;
    let query = `
      SELECT e.id, e.title, e.event_type, COUNT(r.id) as registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
    `;
    const params = [];

    if (event_type) {
      query += " WHERE e.event_type = ?";
      params.push(event_type);
    }

    query += " GROUP BY e.id ORDER BY registrations DESC";

    const rows = await db.all(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top active students (by attendance count)
app.get("/reports/students/most-active", async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const rows = await db.all(
      `SELECT s.id, s.name, COUNT(a.id) as events_attended
       FROM students s
       LEFT JOIN attendance a ON s.id = a.student_id
       GROUP BY s.id
       ORDER BY events_attended DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student participation (how many events one student attended)
app.get("/reports/students/:studentId/participation", async (req, res) => {
  try {
    const { studentId } = req.params;
    const row = await db.get(
      `SELECT s.id as student_id, s.name, COUNT(a.id) as events_attended
       FROM students s
       LEFT JOIN attendance a ON s.id = a.student_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [studentId]
    );
    res.json(row || { student_id: studentId, name: null, events_attended: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
import path from "path";
import { fileURLToPath } from "url";

// For serving frontend build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ------------------ Start Server ------------------
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
