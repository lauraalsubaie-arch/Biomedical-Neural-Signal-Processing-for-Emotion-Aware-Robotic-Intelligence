import { BellRing, CheckCheck } from "lucide-react";
import { api } from "../services/api";
import useNotifications from "../hooks/useNotifications";

export default function Notifications({ user }) {
  const { notifications, unread, refresh } = useNotifications(user.id);
  async function read(id){ await api.markNotificationRead(id); refresh(); }
  async function all(){ await api.markAllNotificationsRead(user.id); refresh(); }
  return <div><div className="page-title-block row"><div><h2>Notifications</h2><p>{unread} unread updates from messages, reports, appointments, and sensor alerts.</p></div><button className="ghost-btn" onClick={all}><CheckCheck size={16}/>Mark all read</button></div><div className="notification-list">{notifications.map(n=><button key={n.id} className={`notification-card ${!n.read?"unread":""} ${n.priority.toLowerCase()}`} onClick={()=>read(n.id)}><BellRing size={20}/><div><strong>{n.title}</strong><p>{n.body}</p><small>{new Date(n.createdAt).toLocaleString()} · {n.type}</small></div></button>)}</div></div>
}
