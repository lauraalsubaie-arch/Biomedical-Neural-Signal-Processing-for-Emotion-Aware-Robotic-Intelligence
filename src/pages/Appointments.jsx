import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";
import { api } from "../services/api";

export default function Appointments({ user }) {
  const [items, setItems] = useState([]); const [status, setStatus] = useState("");
  async function load(){ setItems(await api.getAppointments(user)); }
  useEffect(()=>{ load(); },[user]);
  async function update(id, updates){ await api.updateAppointment(id, updates, user.id); setStatus("Appointment updated."); load(); }
  return <div><div className="page-title-block"><h2>Appointments</h2><p>Review, confirm, cancel, and complete eCheck-in style intake.</p></div><div className="appointment-list">{items.map(a=><div className="appointment-card" key={a.id}><div><h3>{user.role==="Doctor"?a.patient?.name:a.doctor?.name}</h3><p>{a.type} · {new Date(a.dateTime).toLocaleString()}</p><span>{a.reason}</span></div><div><strong className={`status ${a.status.toLowerCase()}`}>{a.status}</strong><small>{a.checkInComplete?"Check-in complete":"Check-in pending"}</small></div><div className="row-actions">{user.role==="Doctor" && a.status==="Pending" && <button className="mini-btn" onClick={()=>update(a.id,{status:"Confirmed"})}><CheckCircle2 size={14}/>Confirm</button>}<button className="mini-btn" onClick={()=>update(a.id,{checkInComplete:true})}><ClipboardCheck size={14}/>Check-in</button><button className="danger-btn small" onClick={()=>update(a.id,{status:"Cancelled"})}><XCircle size={14}/>Cancel</button></div></div>)}</div>{status && <div className="toast">{status}</div>}</div>
}
