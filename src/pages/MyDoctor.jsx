import { useEffect, useState } from "react";
import { Calendar, Mail, Trash2 } from "lucide-react";
import { api } from "../services/api";

export default function MyDoctor({ user, setUser, setPage }) {
  const [doctor, setDoctor] = useState(null); const [reports, setReports] = useState([]); const [message, setMessage] = useState(""); const [status, setStatus] = useState("");
  useEffect(()=>{ async function load(){ const docs=await api.getDoctors(); setDoctor(docs.find(d=>d.id===user.doctorId)); setReports(await api.getReports(user)); } load(); },[user]);
  if(!doctor) return <div className="empty-state"><h2>No doctor selected</h2><p>Book a doctor to unlock secure messages, appointments, and feedback.</p><button className="primary-btn" onClick={()=>setPage("book")}>Find Doctor</button></div>;
  async function remove(){ await api.removeDoctor({patientId:user.id}); setUser({...user, doctorId:null}); }
  async function send(){ await api.sendMessage({fromId:user.id,toId:doctor.id,text:message}); setMessage(""); setStatus("Message sent to your doctor."); }
  return <div><div className="doctor-hero"><div className="avatar-xl">{doctor.avatar}</div><div><p className="eyebrow">Your care team</p><h2>{doctor.name}</h2><p>{doctor.specialization} · {doctor.email}</p><span>{doctor.bio}</span></div><button className="danger-btn" onClick={remove}><Trash2 size={16}/>Remove</button></div><div className="three-col"><div className="card"><h3>Set Up Meeting</h3><p>Book through the appointment flow with validated time and reason.</p><button className="primary-btn" onClick={()=>setPage("book")}><Calendar size={16}/>Book visit</button></div><div className="card"><h3>Send Direct Message</h3><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a secure message..."/><button className="primary-btn" onClick={send} disabled={!message.trim()}><Mail size={16}/>Send</button></div><div className="card"><h3>Latest Feedback</h3>{reports[0]?.recommendations?.map((r,i)=><p className="note" key={i}>{r}</p>) || <p>No feedback yet.</p>}</div></div>{status && <div className="toast">{status}</div>}</div>
}
