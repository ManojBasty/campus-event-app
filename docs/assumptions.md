# 📘 Assumptions and Design Decisions

## ✅ Assumptions
1. **Database Choice** → SQLite is used instead of MySQL because it’s lightweight, requires no external installation, and is enough for a college-scale event reporting system.  
2. **Data Model** → Each student belongs to a single college, and students can register for multiple events.  
3. **Participation Tracking** → Attendance table is used to calculate student participation (number of events attended).  
4. **Event Types** → Events are categorized as Workshop, TechTalk, or Fest (more can be added later).  
5. **User Scope** → The system is designed for **admins/event coordinators**, not for student self-registration.  
6. **Frontend Integration** → In production, React build is served from the Express backend, so only one server is needed.  

---

## 🎨 Design Decisions
1. **Tech Stack**  
   - **Backend** → Node.js + Express + SQLite (simple, portable).  
   - **Frontend** → React (Vite for fast dev), Tailwind CSS (for styling), Recharts (for charts).  
   - **API Communication** → Axios is used for clean HTTP requests.  

2. **Architecture**  
   - Backend follows **REST API design**: `/colleges`, `/events`, `/reports/...`.  
   - Database has normalized tables: **colleges**, **students**, **events**, **registrations**, **attendance**.  
   - Reports (popularity, most active students, participation) are computed via SQL joins/aggregates.  

3. **UI/UX**  
   - Dashboard layout uses **cards in a grid** for readability.  
   - Added **filters (event type)** and **search (student participation by ID)** to improve usability.  
   - Responsive design ensures it works on both desktop and mobile.  

4. **Scalability**  
   - SQLite is fine for a prototype, but the same schema can migrate to MySQL/Postgres later.  
   - Separate frontend & backend structure makes deployment flexible.  

5. **Deployment Choice**  
   - Single backend server serves both API + frontend build → simple deployment.  
   - Can easily be hosted on **Render/Railway/Heroku** for free student projects.  
