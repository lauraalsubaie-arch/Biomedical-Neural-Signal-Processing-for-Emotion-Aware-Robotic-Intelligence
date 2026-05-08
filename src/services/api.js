import { seedDoctors, seedPatients, seedSessions, seedMessages, seedAppointments, seedReports, seedNotifications } from "../data/seedData";
import { isValidEmail, isValidPassword, validateAppointment, validateMessage } from "../utils/validation";

const DB_KEY = "calmy_medical_db_v2";
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function initialDb() {
  return {
    doctors: seedDoctors,
    patients: seedPatients,
    sessions: seedSessions,
    messages: seedMessages,
    appointments: seedAppointments,
    reports: seedReports,
    notifications: seedNotifications,
    auditLog: [],
  };
}

function db() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const starter = initialDb();
    localStorage.setItem(DB_KEY, JSON.stringify(starter));
    return starter;
  }
  try { return JSON.parse(raw); } catch { return initialDb(); }
}

function save(next) {
  localStorage.setItem(DB_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("calmy-db-update"));
  return next;
}

function audit(action, userId, details = {}) {
  const state = db();
  state.auditLog.unshift({ id: `AUD-${Date.now()}`, action, userId, details, createdAt: new Date().toISOString() });
  save(state);
}

async function realRequest(path, options = {}) {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  resetDemo() { localStorage.removeItem(DB_KEY); return db(); },
  async login({ email, password, role }) {
    await wait();
    if (!isValidEmail(email)) throw new Error("Invalid email");
    if (!isValidPassword(password)) throw new Error("Invalid password");
    const state = db();
    const group = role === "Doctor" ? state.doctors : state.patients;
    let user = group.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      user = role === "Doctor"
        ? { id: `D-${Date.now()}`, name, email, password, role, specialization: "Neurology", license: "Pending", phone: "", bio: "", avatar: name.slice(0,2).toUpperCase(), rating: 0, availability: [] }
        : { id: `P-${Date.now()}`, name, email, password, role, age: "", dob: "", gender: "", maritalStatus: "", phone: "", emergencyContact: "", address: "", bio: "", bloodType: "", allergies: "", medications: "", doctorId: null, risk: "Stable", eegAvg: 0, ppgAvg: 0, heartRate: 0, sleepScore: 0, consentSigned: false, avatar: name.slice(0,2).toUpperCase() };
      if (role === "Doctor") state.doctors.push(user); else state.patients.push(user);
      save(state);
    }
    audit("LOGIN", user.id, { role });
    const { password: _hidden, ...safeUser } = user;
    return { ...safeUser, token: `demo-token-${user.id}` };
  },
  async register(payload) {
    await wait();
    if (!isValidEmail(payload.email)) throw new Error("Invalid email");
    if (!isValidPassword(payload.password)) throw new Error("Invalid password");
    const state = db();
    const exists = [...state.doctors, ...state.patients].some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error("Email already exists");
    const id = payload.role === "Doctor" ? `D-${Date.now()}` : `P-${Date.now()}`;
    const user = payload.role === "Doctor"
      ? { id, role: "Doctor", name: payload.name, email: payload.email, password: payload.password, specialization: payload.specialization || "Neurology", license: payload.license || "Pending", phone: payload.phone || "", bio: payload.bio || "", avatar: payload.name.slice(0,2).toUpperCase(), rating: 0, availability: [] }
      : { id, role: "Patient", name: payload.name, email: payload.email, password: payload.password, age: payload.age || "", dob: payload.dob || "", gender: payload.gender || "", maritalStatus: payload.maritalStatus || "", phone: payload.phone || "", emergencyContact: "", address: "", bio: "", bloodType: "", allergies: "", medications: "", doctorId: null, risk: "Stable", eegAvg: 0, ppgAvg: 0, heartRate: 0, sleepScore: 0, consentSigned: true, avatar: payload.name.slice(0,2).toUpperCase() };
    if (payload.role === "Doctor") state.doctors.push(user); else state.patients.push(user);
    save(state); audit("REGISTER", id, { role: payload.role });
    const { password: _hidden, ...safeUser } = user;
    return { ...safeUser, token: `demo-token-${id}` };
  },
  async forgotPassword(email) { await wait(); if (!isValidEmail(email)) throw new Error("Invalid email"); return { success: true }; },
  async getDoctors() { return (await realRequest("/doctors")) || db().doctors.map(({password, ...d}) => d); },
  async getPatients(doctorId) { const data = (await realRequest(`/doctors/${doctorId}/patients`)) || db().patients; return doctorId ? data.filter((p) => p.doctorId === doctorId) : data; },
  async getPatient(patientId) { return db().patients.find((p) => p.id === patientId); },
  async getSessions({ role, userId }) { const s = (await realRequest(`/sessions?role=${role}&userId=${userId}`)) || db().sessions; if (role === "Patient") return s.filter((x) => x.patientId === userId); if (role === "Doctor") { const ids = db().patients.filter(p => p.doctorId === userId).map(p => p.id); return s.filter(x => ids.includes(x.patientId)); } return s; },
  async getLiveSensorData(patientId) { await wait(120); const patient = db().patients.find(p => p.id === patientId) || db().patients[0]; const eeg = Math.max(0, Number(patient.eegAvg || 4200) + Math.floor(Math.random()*180 - 90)); const ppg = Math.max(0, Number(patient.ppgAvg || 1900) + Math.floor(Math.random()*80 - 40)); const heartRate = Math.max(45, Number(patient.heartRate || 72) + Math.floor(Math.random()*8 - 4)); const score = eeg*0.6 + ppg*0.3; const risk = score > 4500 ? "High" : score > 3200 ? "Moderate" : "Stable"; return { patientId, eeg, ppg, heartRate, risk, battery: 86 + Math.floor(Math.random()*8), packetLoss: Math.floor(Math.random()*3), connected: true, timestamp: new Date().toISOString() }; },
  async bookDoctor({ patientId, doctorId, dateTime, reason, type }) { await wait(); const errors = validateAppointment({ dateTime, reason, type }); if (Object.keys(errors).length) throw { errors }; const state = db(); const patient = state.patients.find(p => p.id === patientId); if (!patient) throw new Error("Patient not found"); patient.doctorId = doctorId; const appt = { id: `A-${Date.now()}`, patientId, doctorId, dateTime, reason, type, status: "Pending", checkInComplete: false }; state.appointments.unshift(appt); state.notifications.unshift({ id: `N-${Date.now()}`, userId: doctorId, type: "appointment", title: "New appointment request", body: `${patient.name} requested a ${type}.`, createdAt: new Date().toISOString(), read: false, priority: "Normal" }); save(state); audit("BOOK_DOCTOR", patientId, { doctorId, appointmentId: appt.id }); return appt; },
  async removeDoctor({ patientId }) { await wait(); const state = db(); const p = state.patients.find(x => x.id === patientId); if (p) p.doctorId = null; save(state); audit("REMOVE_DOCTOR", patientId); return { success: true }; },
  async getAppointments(user) { const state = db(); let items = state.appointments; if (user.role === "Patient") items = items.filter(a => a.patientId === user.id); if (user.role === "Doctor") items = items.filter(a => a.doctorId === user.id); return items.map(a => ({...a, patient: state.patients.find(p => p.id === a.patientId), doctor: state.doctors.find(d => d.id === a.doctorId)})); },
  async updateAppointment(id, updates, actorId) { await wait(); const state = db(); const appt = state.appointments.find(a => a.id === id); if (!appt) throw new Error("Appointment not found"); Object.assign(appt, updates); const notifyId = actorId === appt.patientId ? appt.doctorId : appt.patientId; state.notifications.unshift({ id: `N-${Date.now()}`, userId: notifyId, type: "appointment", title: "Appointment updated", body: `Appointment ${appt.status || "updated"} for ${new Date(appt.dateTime).toLocaleString()}.`, createdAt: new Date().toISOString(), read: false, priority: appt.status === "Cancelled" ? "High" : "Normal" }); save(state); audit("UPDATE_APPOINTMENT", actorId, { id, updates }); return appt; },
  async getThreads(user) { const state = db(); const relevant = state.messages.filter(m => m.fromId === user.id || m.toId === user.id); const threadIds = [...new Set(relevant.map(m => m.threadId))]; return threadIds.map(threadId => { const msgs = state.messages.filter(m => m.threadId === threadId).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)); const last = msgs[msgs.length-1]; const otherId = last.fromId === user.id ? last.toId : last.fromId; const other = [...state.patients, ...state.doctors].find(u => u.id === otherId); return { threadId, other, messages: msgs, unread: msgs.filter(m => m.toId === user.id && !m.read).length, last }; }).sort((a,b)=>new Date(b.last.createdAt)-new Date(a.last.createdAt)); },
  async sendMessage({ fromId, toId, text }) { await wait(); const error = validateMessage(text); if (error) throw new Error(error); const ids = [fromId, toId].sort().join("-"); const msg = { id: `M-${Date.now()}`, threadId: `T-${ids}`, fromId, toId, text: text.trim(), createdAt: new Date().toISOString(), read: false }; const state = db(); state.messages.push(msg); const sender = [...state.patients, ...state.doctors].find(u => u.id === fromId); state.notifications.unshift({ id: `N-${Date.now()+1}`, userId: toId, type: "message", title: `New message from ${sender?.name || "Care team"}`, body: text.slice(0, 90), createdAt: new Date().toISOString(), read: false, priority: "Normal" }); save(state); audit("SEND_MESSAGE", fromId, { toId }); return msg; },
  async markThreadRead(userId, threadId) { const state = db(); state.messages.forEach(m => { if (m.threadId === threadId && m.toId === userId) m.read = true; }); save(state); return { success: true }; },
  async getReports(user) { const state = db(); let reports = state.reports; if (user.role === "Patient") reports = reports.filter(r => r.patientId === user.id); if (user.role === "Doctor") { const ids = state.patients.filter(p => p.doctorId === user.id).map(p=>p.id); reports = reports.filter(r => ids.includes(r.patientId)); } return reports.map(r => ({...r, patient: state.patients.find(p => p.id === r.patientId), doctor: state.doctors.find(d => d.id === r.doctorId)})); },
  async saveReport(report, actorId) { await wait(); const state = db(); const index = state.reports.findIndex(r => r.id === report.id); const next = { ...report, updatedAt: new Date().toISOString() }; if (index >= 0) state.reports[index] = next; else state.reports.unshift({ ...next, id: `R-${Date.now()}` }); state.notifications.unshift({ id: `N-${Date.now()}`, userId: report.patientId, type: "report", title: "Medical report updated", body: "Your care team updated your monitoring report.", createdAt: new Date().toISOString(), read: false, priority: "Normal" }); save(state); audit("SAVE_REPORT", actorId, { patientId: report.patientId }); return next; },
  async getNotifications(userId) { return db().notifications.filter(n => n.userId === userId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); },
  async markNotificationRead(id) { const state = db(); const n = state.notifications.find(x => x.id === id); if (n) n.read = true; save(state); return { success: true }; },
  async markAllNotificationsRead(userId) { const state = db(); state.notifications.forEach(n => { if (n.userId === userId) n.read = true; }); save(state); return { success: true }; },
  async updateProfile(user, updates) { await wait(); const state = db(); const list = user.role === "Doctor" ? state.doctors : state.patients; const target = list.find(u => u.id === user.id); if (!target) throw new Error("User not found"); Object.assign(target, updates); save(state); audit("UPDATE_PROFILE", user.id); const { password, ...safe } = target; return { ...safe, token: user.token }; },
  async getAuditLog() { return db().auditLog; },
};
