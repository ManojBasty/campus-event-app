import { useEffect, useState } from "react";
import API from "./api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [colleges, setColleges] = useState([]);
  const [events, setEvents] = useState([]);
  const [popularity, setPopularity] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentParticipation, setStudentParticipation] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState("");


  useEffect(() => {
    API.get("/colleges").then((res) => setColleges(res.data));
    API.get("/events").then((res) => setEvents(res.data));
    API.get("/reports/events/popularity").then((res) =>
      setPopularity(res.data)
    );
    API.get("/reports/students/most-active").then((res) =>
      setActiveStudents(res.data)
    );
  }, []);

  const fetchParticipation = async () => {
    if (!studentId) return;
    try {
      const res = await API.get(
        `/reports/students/${studentId}/participation`
      );
      setStudentParticipation(res.data);
    } catch (err) {
      setStudentParticipation({ error: "Student not found" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          🎓 Campus Events Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Track colleges, events, students, and participation in one place
        </p>
      </header>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colleges */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🏫 Colleges
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {colleges.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>

        {/* Events */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📅 Upcoming Events
          </h2>
          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="border-b last:border-b-0 pb-2 text-gray-700"
              >
                <strong>{e.title}</strong>{" "}
                <span className="text-sm text-gray-500">
                  ({e.event_type}) — {e.start_date}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Popularity */}
        <div className="bg-white p-6 rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📊 Event Popularity
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={popularity}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="registrations" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Students */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🏆 Most Active Students
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {activeStudents.map((s) => (
              <li key={s.id}>
                {s.name} —{" "}
                <span className="font-semibold">{s.events_attended}</span>{" "}
                events
              </li>
            ))}
          </ol>
        </div>

        {/* Student Participation Search */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🔍 Student Participation
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={fetchParticipation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          {studentParticipation && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              {studentParticipation.error ? (
                <p className="text-red-500">{studentParticipation.error}</p>
              ) : (
                <p className="text-gray-700">
                  <strong>{studentParticipation.name || "Unknown Student"}</strong>{" "}
                  attended{" "}
                  <span className="font-semibold text-blue-600">
                    {studentParticipation.events_attended}
                  </span>{" "}
                  events.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
