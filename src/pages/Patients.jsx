import { useEffect, useState } from "react";
import { api } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import Modal from "../components/Modal";

export default function Patients({ user, setPage, setSelectedPatient }) {
  const [patients,setPatients]=useState([]); const [modal,setModal]=useState(null); const [text,setText]=useState("");
  async function load(){ setPatients(await api.getPatients(user.id)); }
  useEffect(()=>{ load(); },[user]);
  async function send(){ if(modal.type==="message") await api.sendMessage({fromId:user.id,toId:modal.patient.id,text}); else await api.saveReport({ id:`R-${Date.now()}`, patientId:modal.patient.id, doctorId:user.id, diagnosis:"Clinical monitoring note", summary:text, recommendations:[text], restrictions:"None", doctorSignature:user.name }, user.id); setText(""); setModal(null); }
  return <div><div className="page-title-block"><h2>Patients</h2><p>Manage patient profiles, request meetings, send messages, and edit reports.</p></div><div className="patient-grid">{patients.map(p=><div className="patient-card" key={p.id}><div className="mini-avatar large">{p.avatar}</div><div><h3>{p.name}</h3><p>{p.id} · Age {p.age} · {p.email}</p><RiskBadge level={p.risk}/></div><div className="patient-actions"><button className="mini-btn" onClick={()=>{setSelectedPatient(p);setPage("reports")}}>Report</button><button className="mini-btn" onClick={()=>setModal({type:"message",patient:p})}>Message</button><button className="mini-btn" onClick={()=>setModal({type:"feedback",patient:p})}>Feedback</button><button className="mini-btn" onClick={()=>api.updateAppointment(`REQ-${Date.now()}`,{}).catch(()=>alert("Use Appointments to request a meeting."))}>Meeting</button></div></div>)}</div>{modal&&<Modal title={`${modal.type==="message"?"Message":"Feedback for"} ${modal.patient.name}`} onClose={()=>setModal(null)}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write here..."/><div className="modal-actions"><button className="ghost-btn" onClick={()=>setModal(null)}>Cancel</button><button className="primary-btn" onClick={send}>Send</button></div></Modal>}</div>
}
