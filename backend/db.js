import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite DB
export const db = await open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
});

// Initialize tables
await db.exec(`
CREATE TABLE IF NOT EXISTS colleges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK(event_type IN ('Workshop','Fest','Seminar','Hackathon','TechTalk','Other')) DEFAULT 'Other',
  start_date TEXT,
  end_date TEXT,
  status TEXT CHECK(status IN ('Scheduled','Cancelled','Completed')) DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, event_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  attended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, event_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, event_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
`);

console.log("✅ Database initialized and tables are ready.");
