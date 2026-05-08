import { useState } from "react";
import { Brain, HeartPulse, Lock, ShieldCheck, UserRoundCheck } from "lucide-react";
import { api } from "../services/api";
import { isValidEmail, isValidPassword } from "../utils/validation";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("Patient");
  const [form, setForm] = useState({ name: "", email: "ali@calmy.health", password: "patient123", specialization: "Neurology", license: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function submit(e) {
    e.preventDefault(); setError("");
    if (!isValidEmail(form.email)) return setError("Use a valid email address.");
    if (mode !== "forgot" && !isValidPassword(form.password)) return setError("Password must be at least 8 characters.");
    if (mode === "register" && form.name.trim().length < 2) return setError("Enter your full name.");
    try {
      setLoading(true);
      if (mode === "forgot") { await api.forgotPassword(form.email); alert("Reset link sent."); setMode("login"); return; }
      const user = mode === "register" ? await api.register({ ...form, role }) : await api.login({ email: form.email, password: form.password, role });
      onLogin(user);
    } catch (err) { setError(err.message || "Unable to complete request."); }
    finally { setLoading(false); }
  }

  function quickLogin(nextRole) {
    setRole(nextRole);
    setForm((p) => ({ ...p, email: nextRole === "Doctor" ? "mohammed@calmy.health" : "ali@calmy.health", password: nextRole === "Doctor" ? "doctor123" : "patient123" }));
  }

  return <div className="auth-page">
    <div className="auth-panel">
      <div className="auth-brand"><div><ShieldCheck/></div><span>Calmy</span></div>
      <h1>{mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}</h1>
      <p>Secure EEG/PPG clinical monitoring for patients and doctors.</p>
      <form onSubmit={submit} className="auth-form">
        {mode !== "forgot" && <div className="segmented">{["Patient","Doctor"].map(r => <button type="button" key={r} className={role===r?"active":""} onClick={() => quickLogin(r)}>{r}</button>)}</div>}
        {mode === "register" && <label>Full name<input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Full name" /></label>}
        <label>Email<input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="name@example.com" /></label>
        {mode !== "forgot" && <label>Password<input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Minimum 8 characters" /></label>}
        {mode === "register" && role === "Doctor" && <><label>Specialization<select value={form.specialization} onChange={e=>set("specialization",e.target.value)}><option>Neurology</option><option>Sleep Medicine</option><option>Cardiology</option><option>Psychiatry</option><option>Biomedical Engineering</option></select></label><label>License number<input value={form.license} onChange={e=>set("license",e.target.value)} placeholder="SCFHS / license number" /></label></>}
        {error && <div className="form-error">{error}</div>}
        <button className="primary-btn" disabled={loading}>{loading ? "Checking..." : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}</button>
      </form>
      <div className="auth-links">{mode === "login" ? <><button onClick={()=>setMode("forgot")}>Forgot password?</button><button onClick={()=>setMode("register")}>Register</button></> : <button onClick={()=>setMode("login")}>Back to login</button>}</div>
    </div>
    <div className="auth-hero">
      <div className="hero-glass"><h2> Stay calm with calmy </h2><p> Track your data with trusted doctors and advaned technology to enjoy a stress free and high quality sleep. </p><div className="hero-metrics"><span><Brain/>EEG</span><span><HeartPulse/>PPG</span><span><Lock/>Secure</span><span><UserRoundCheck/>Care Team</span></div></div>
    </div>
  </div>
}
