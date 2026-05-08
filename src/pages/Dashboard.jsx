import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, BatteryCharging, BluetoothConnected, HeartPulse, Users, Wifi } from "lucide-react";
import { api } from "../services/api";
import useLiveSensorData from "../hooks/useLiveSensorData";
import RiskBadge from "../components/RiskBadge";

function Stat({ icon: Icon, label, value, sub, tone = "purple" }) { return <div className={`metric-card ${tone}`}><div className="metric-icon"><Icon size={20}/></div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>; }
function getScore(eeg=0, ppg=0){ return Math.round(eeg*0.6 + ppg*0.3); }

export default function Dashboard({ user, setPage, setSelectedPatient }) {
  const [patients, setPatients] = useState([]); const [sessions, setSessions] = useState([]);
  const patientId = user.role === "Patient" ? user.id : patients[0]?.id;
  const { liveData, status, history } = useLiveSensorData(patientId, true);
  useEffect(()=>{ async function load(){ setPatients(user.role === "Doctor" ? await api.getPatients(user.id) : []); setSessions(await api.getSessions({role:user.role, userId:user.id})); } load(); },[user]);
  const chart = history.length > 2 ? history : sessions.slice(0,8).reverse().map(s=>({time:s.date.slice(5), EEG:s.eeg, PPG:s.ppg, HR:s.heartRate}));
  const high = patients.filter(p=>p.risk==="High").length;
  const current = user.role === "Patient" ? liveData : patients[0];
  const score = getScore(current?.eeg || current?.eegAvg, current?.ppg || current?.ppgAvg);

  if (user.role === "Doctor") return <>
    <div className="dashboard-hero"><div><p className="eyebrow">Clinical command center</p><h2>Monitor assigned patients, session quality, and urgent risk states.</h2></div><div className="hero-status"><Wifi size={18}/>Backend-ready API layer active</div></div>
    <div className="metrics-grid"><Stat icon={Users} label="Assigned Patients" value={patients.length} sub="Under your care"/><Stat icon={Activity} label="High Risk" value={high} sub="Needs review" tone="pink"/><Stat icon={HeartPulse} label="Avg Fusion Score" value={patients.length ? Math.round(patients.reduce((a,p)=>a+getScore(p.eegAvg,p.ppgAvg),0)/patients.length) : "—"} sub="EEG × PPG fusion"/><Stat icon={BluetoothConnected} label="Sessions" value={sessions.length} sub="Synced recordings" tone="white"/></div>
    <div className="two-col"><div className="card"><div className="card-head"><div><h3>Patient Trend Overview</h3><p>Aggregated EEG, PPG, and HR movement</p></div></div><ResponsiveContainer height={310}><LineChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff"/><XAxis dataKey="time"/><YAxis/><Tooltip/><Legend/><Line dataKey="EEG" stroke="#7c3aed" strokeWidth={3} dot={false}/><Line dataKey="PPG" stroke="#ec4899" strokeWidth={3} dot={false}/><Line dataKey="HR" stroke="#06b6d4" strokeWidth={2.5} dot={false}/></LineChart></ResponsiveContainer></div>
    <div className="card"><div className="card-head"><div><h3>Priority Queue</h3><p>Patients requiring attention</p></div></div>{patients.filter(p=>p.risk!=="Stable").map(p=><button className="priority-row" key={p.id} onClick={()=>{setSelectedPatient(p); setPage("reports")}}><div><strong>{p.name}</strong><span>{p.lastSession} · score {getScore(p.eegAvg,p.ppgAvg)}</span></div><RiskBadge level={p.risk}/></button>)}</div></div>
    <div className="card"><div className="card-head"><div><h3>Recent Patient Sessions</h3><p>Validated session stream from sensor service</p></div><button className="ghost-btn" onClick={()=>setPage("history")}>View all</button></div><table><thead><tr><th>Patient</th><th>Session</th><th>Quality</th><th>Sensor</th><th>Risk</th><th></th></tr></thead><tbody>{sessions.map(s=>{ const p=patients.find(x=>x.id===s.patientId); return <tr key={s.id}><td>{p?.name||s.patientId}</td><td>{s.id} · {s.date}</td><td>{s.quality}</td><td>{s.sensorStatus}</td><td><RiskBadge level={s.risk}/></td><td><button className="mini-btn" onClick={()=>{setSelectedPatient(p); setPage("reports")}}>Report</button></td></tr>})}</tbody></table></div>
  </>;

  return <>
    <div className="dashboard-hero"><div><p className="eyebrow">Live monitoring</p><h2>Your current EEG/PPG status is {status === "live" ? "connected" : "connecting"}.</h2></div><div className={`hero-status ${status}`}><BluetoothConnected size={18}/>{status}</div></div>
    <div className="metrics-grid"><Stat icon={Activity} label="Live EEG" value={liveData?.eeg ?? "—"} sub="Neural signal average"/><Stat icon={HeartPulse} label="Live PPG" value={liveData?.ppg ?? "—"} sub="Cardiac signal average" tone="pink"/><Stat icon={HeartPulse} label="Heart Rate" value={liveData?.heartRate ? `${liveData.heartRate} bpm` : "—"} sub="Current pulse"/><Stat icon={BatteryCharging} label="Device Health" value={liveData?.battery ? `${liveData.battery}%` : "—"} sub={`${liveData?.packetLoss ?? 0}% packet loss`} tone="white"/></div>
    <div className="two-col"><div className="card"><div className="card-head"><div><h3>Real-Time Signal Stream</h3><p>Updates every 3 seconds; ready for WebSocket replacement</p></div></div><ResponsiveContainer height={310}><AreaChart data={chart}><defs><linearGradient id="eegFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity=".25"/><stop offset="95%" stopColor="#7c3aed" stopOpacity="0"/></linearGradient><linearGradient id="ppgFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity=".25"/><stop offset="95%" stopColor="#ec4899" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff"/><XAxis dataKey="time"/><YAxis/><Tooltip/><Legend/><Area dataKey="EEG" stroke="#7c3aed" fill="url(#eegFill)" strokeWidth={3}/><Area dataKey="PPG" stroke="#ec4899" fill="url(#ppgFill)" strokeWidth={3}/></AreaChart></ResponsiveContainer></div><div className="card risk-card"><p className="eyebrow">Fusion result</p><h3>{liveData?.risk || "Moderate"}</h3><RiskBadge level={liveData?.risk || "Moderate"}/><p>Current fusion score: <strong>{score || "—"}</strong></p><small>This is monitoring support only, not a diagnosis.</small></div></div>
    <div className="card"><div className="card-head"><div><h3>Latest Sessions</h3><p>Validated recordings and sensor quality</p></div><button className="ghost-btn" onClick={()=>setPage("history")}>Open history</button></div><table><thead><tr><th>Session</th><th>Date</th><th>Duration</th><th>Quality</th><th>Risk</th></tr></thead><tbody>{sessions.map(s=><tr key={s.id}><td>{s.id}</td><td>{s.date}</td><td>{s.duration}</td><td>{s.quality}</td><td><RiskBadge level={s.risk}/></td></tr>)}</tbody></table></div>
  </>
}
