import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { api } from "../services/api";

export default function Chat({ user }) {
  const [threads, setThreads] = useState([]); const [activeId, setActiveId] = useState(null); const [text, setText] = useState("");
  async function load(){ const t=await api.getThreads(user); setThreads(t); if(!activeId && t[0]) setActiveId(t[0].threadId); }
  useEffect(()=>{ load(); const on=()=>load(); window.addEventListener("calmy-db-update",on); return()=>window.removeEventListener("calmy-db-update",on); },[user, activeId]);
  const active = useMemo(()=>threads.find(t=>t.threadId===activeId),[threads,activeId]);
  async function choose(id){ setActiveId(id); await api.markThreadRead(user.id,id); load(); }
  async function send(){ if(!text.trim()||!active?.other) return; await api.sendMessage({fromId:user.id,toId:active.other.id,text}); setText(""); load(); }
  return <div className="chat-shell"><aside className="thread-list"><h3>Secure Messages</h3>{threads.map(t=><button key={t.threadId} className={`thread ${activeId===t.threadId?"active":""}`} onClick={()=>choose(t.threadId)}><div className="mini-avatar">{t.other?.avatar || t.other?.name?.slice(0,2)}</div><div><strong>{t.other?.name}</strong><span>{t.last.text.slice(0,42)}...</span></div>{t.unread>0&&<em>{t.unread}</em>}</button>)}</aside><section className="chat-panel">{active ? <><div className="chat-head"><h3>{active.other?.name}</h3><p>Encrypted clinical conversation</p></div><div className="messages">{active.messages.map(m=><div key={m.id} className={`bubble ${m.fromId===user.id?"mine":"theirs"}`}><p>{m.text}</p><small>{new Date(m.createdAt).toLocaleString()}</small></div>)}</div><div className="composer"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a secure message..."/><button className="primary-btn" onClick={send}><Send size={16}/>Send</button></div></> : <div className="empty-state"><h2>No conversations yet</h2><p>Messages appear after a doctor or patient starts a thread.</p></div>}</section></div>
}
