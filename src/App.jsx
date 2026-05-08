import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookDoctor from "./pages/BookDoctor";
import MyDoctor from "./pages/MyDoctor";
import Appointments from "./pages/Appointments";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Patients from "./pages/Patients";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

const USER_KEY = "calmy_active_user_v2";

export default function App() {
  const [user, setUserState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);

  function setUser(next) {
    setUserState(next);
    if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
    else localStorage.removeItem(USER_KEY);
  }

  useEffect(() => { if (!user) setPage("dashboard"); }, [user]);
  if (!user) return <Login onLogin={setUser} />;

  const props = { user, setUser, page, setPage, selectedPatient, setSelectedPatient };
  let content;
  if (page === "dashboard") content = <Dashboard {...props} />;
  else if (page === "book") content = <BookDoctor {...props} />;
  else if (page === "doctor") content = <MyDoctor {...props} />;
  else if (page === "appointments") content = <Appointments {...props} />;
  else if (page === "chat") content = <Chat {...props} />;
  else if (page === "notifications") content = <Notifications {...props} />;
  else if (page === "profile") content = <Profile {...props} />;
  else if (page === "patients") content = <Patients {...props} />;
  else if (page === "history") content = <History {...props} />;
  else if (page === "reports") content = <Reports {...props} />;
  else if (page === "settings") content = <Settings {...props} />;
  else if (page === "help") content = <Help {...props} />;
  else content = <Dashboard {...props} />;

  return <Layout user={user} page={page} setPage={setPage} onLogout={() => setUser(null)}>{content}</Layout>;
}
