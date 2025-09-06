import { db } from "./db.js";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear old data
  await db.exec("DELETE FROM feedback");
  await db.exec("DELETE FROM attendance");
  await db.exec("DELETE FROM registrations");
  await db.exec("DELETE FROM events");
  await db.exec("DELETE FROM students");
  await db.exec("DELETE FROM colleges");

  // Insert College
  const college = await db.run("INSERT INTO colleges (name) VALUES (?)", ["Demo College"]);
  const collegeId = college.lastID;

  // Insert Students
  const students = [
    ["Alice", "alice@example.com", 2],
    ["Bob", "bob@example.com", 3],
    ["Charlie", "charlie@example.com", 1],
    ["David", "david@example.com", 4],
    ["Eva", "eva@example.com", 2],
  ];

  for (let s of students) {
    await db.run("INSERT INTO students (college_id, name, email, year) VALUES (?, ?, ?, ?)", [
      collegeId,
      s[0],
      s[1],
      s[2],
    ]);
  }

  // Insert Events
  const event1 = await db.run(
    "INSERT INTO events (college_id, title, description, event_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
    [collegeId, "Intro to React", "Beginner friendly React workshop", "Workshop", "2025-09-10", "2025-09-10"]
  );
  const event2 = await db.run(
    "INSERT INTO events (college_id, title, description, event_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
    [collegeId, "AI Trends Talk", "Tech talk on latest AI trends", "TechTalk", "2025-09-15", "2025-09-15"]
  );
  const event3 = await db.run(
    "INSERT INTO events (college_id, title, description, event_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
    [collegeId, "Autumn Fest", "Annual cultural fest", "Fest", "2025-10-01", "2025-10-03"]
  );

  // Insert Registrations
  await db.run("INSERT INTO registrations (student_id, event_id) VALUES (1, ?)", [event1.lastID]);
  await db.run("INSERT INTO registrations (student_id, event_id) VALUES (2, ?)", [event1.lastID]);
  await db.run("INSERT INTO registrations (student_id, event_id) VALUES (3, ?)", [event2.lastID]);
  await db.run("INSERT INTO registrations (student_id, event_id) VALUES (4, ?)", [event2.lastID]);
  await db.run("INSERT INTO registrations (student_id, event_id) VALUES (5, ?)", [event3.lastID]);

  // Insert Attendance
  await db.run("INSERT INTO attendance (student_id, event_id) VALUES (1, ?)", [event1.lastID]);
  await db.run("INSERT INTO attendance (student_id, event_id) VALUES (2, ?)", [event1.lastID]);
  await db.run("INSERT INTO attendance (student_id, event_id) VALUES (3, ?)", [event2.lastID]);

  // Insert Feedback
  await db.run("INSERT INTO feedback (student_id, event_id, rating, comment) VALUES (1, ?, ?, ?)", [
    event1.lastID,
    5,
    "Great workshop!",
  ]);
  await db.run("INSERT INTO feedback (student_id, event_id, rating, comment) VALUES (2, ?, ?, ?)", [
    event1.lastID,
    4,
    "Very informative",
  ]);
  await db.run("INSERT INTO feedback (student_id, event_id, rating, comment) VALUES (3, ?, ?, ?)", [
    event2.lastID,
    3,
    "Good session",
  ]);

  console.log("✅ Seeding complete.");
}

seed();
