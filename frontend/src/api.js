import axios from "axios";

const API = axios.create({
  baseURL: "", // leave empty in production (uses same server)
  // OR baseURL: "http://127.0.0.1:3000" during dev
});

export default API;   // ✅ this is required
