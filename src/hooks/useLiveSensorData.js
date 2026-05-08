import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function useLiveSensorData(patientId, enabled = true) {
  const [liveData, setLiveData] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!enabled || !patientId) return;
    let active = true;
    async function pull() {
      try {
        const data = await api.getLiveSensorData(patientId);
        if (!active) return;
        setLiveData(data);
        setHistory((prev) => [...prev.slice(-23), { time: new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), EEG: data.eeg, PPG: data.ppg, HR: data.heartRate }]);
        setStatus(data.connected ? "live" : "offline");
      } catch {
        if (active) setStatus("offline");
      }
    }
    pull();
    const id = setInterval(pull, 3000);
    return () => { active = false; clearInterval(id); };
  }, [patientId, enabled]);

  return { liveData, status, history };
}
