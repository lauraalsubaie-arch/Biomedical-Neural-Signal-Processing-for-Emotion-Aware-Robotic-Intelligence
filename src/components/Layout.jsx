import { Activity, Bell, Calendar, ClipboardList, FileText, HeartPulse, HelpCircle, LogOut, MessageSquare, Settings, User, Users, Stethoscope, Search, ShieldCheck } from "lucide-react";
import useNotifications from "../hooks/useNotifications";

const iconMap = { dashboard: Activity, history: ClipboardList, reports: FileText, book: Stethoscope, doctor: HeartPulse, profile: User, settings: Settings, help: HelpCircle, patients: Users, appointments: Calendar, chat: MessageSquare, notifications: Bell };

const patientNav = [
  ["dashboard", "Dashboard", "dashboard"], ["history", "History", "history"], ["reports", "Medical Reports", "reports"], ["book", "Book Doctor", "book"], ["doctor", "My Doctor", "doctor"], ["appointments", "Appointments", "appointments"], ["chat", "Messages", "chat"], ["notifications", "Notifications", "notifications"], ["profile", "Profile", "profile"], ["settings", "Settings", "settings"], ["help", "Help", "help"]
];
const doctorNav = [
  ["dashboard", "Dashboard", "dashboard"], ["patients", "Patients", "patients"], ["history", "History", "history"], ["reports", "Reports", "reports"], ["appointments", "Appointments", "appointments"], ["chat", "Messages", "chat"], ["notifications", "Notifications", "notifications"], ["profile", "Profile", "profile"], ["settings", "Settings", "settings"], ["help", "Help", "help"]
];

export default function Layout({ user, page, setPage, children, onLogout }) {
  const nav = user.role === "Doctor" ? doctorNav : patientNav;
  const { unread } = useNotifications(user.id);
  const active = nav.find(([id]) => id === page)?.[1] || "Dashboard";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => setPage("dashboard")}>
          <div className="brand-mark"><ShieldCheck size={22} /></div>
          <div><strong>Calmy</strong><span>Clinical Monitor</span></div>
        </div>
        <nav className="nav-list">
          {nav.map(([id, label, icon]) => {
            const Icon = iconMap[icon];
            return <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}><Icon size={18}/><span>{label}</span>{id === "notifications" && unread > 0 && <em>{unread}</em>}</button>;
          })}
        </nav>
        <div className="sidebar-card">
          <div className="mini-avatar">{user.avatar || user.name?.slice(0,2).toUpperCase()}</div>
          <div><strong>{user.name}</strong><span>{user.role}</span></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div><p className="eyebrow">{user.role} Workspace</p><h1>{active}</h1></div>
          <div className="topbar-actions">
            <div className="global-search"><Search size={16}/><input placeholder="Search patients, reports, sessions..." /></div>
            <button className="top-icon" onClick={() => setPage("notifications")}><Bell size={18}/>{unread > 0 && <b>{unread}</b>}</button>
            <button className="logout" onClick={onLogout}><LogOut size={16}/>Logout</button>
          </div>
        </header>
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}
