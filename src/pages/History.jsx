import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function History({ user }) {
  const [sessions,setSessions]=useState([]); const [q,setQ]=useState(""); const [risk,setRisk]=useState("All");
  useEffect(()=>{ api.getSessions({role:user.role,userId:user.id}).then(setSessions); },[user]);
  const filtered=useMemo(()=>sessions.filter(s=>(risk==="All"||s.risk===risk)&&`${s.id} ${s.date} ${s.notes}`.toLowerCase().includes(q.toLowerCase())),[sessions,q,risk]);
  function exportCsv(){ const rows=[["id","patientId","date","eeg","ppg","heartRate","sleepScore","risk","quality"],...filtered.map(s=>[s.id,s.patientId,s.date,s.eeg,s.ppg,s.heartRate,s.sleepScore,s.risk,s.quality])]; const blob=new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="calmy_sessions.csv"; a.click(); }
  return <div><div className="page-title-block row"><div><h2>Session History</h2><p>Search, filter, and export validated sensor sessions.</p></div><button className="primary-btn" onClick={exportCsv}>Export CSV</button></div><div className="toolbar"><input placeholder="Search sessions..." value={q} onChange={e=>setQ(e.target.value)}/><select value={risk} onChange={e=>setRisk(e.target.value)}><option>All</option><option>Stable</option><option>Moderate</option><option>High</option></select></div><div className="card"><table><thead><tr><th>ID</th><th>Date</th><th>Duration</th><th>EEG</th><th>PPG</th><th>HR</th><th>Quality</th><th>Risk</th></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td>{s.id}</td><td>{s.date}</td><td>{s.duration}</td><td>{s.eeg}</td><td>{s.ppg}</td><td>{s.heartRate}</td><td>{s.quality}</td><td><RiskBadge level={s.risk}/></td></tr>)}</tbody></table></div></div>
}
