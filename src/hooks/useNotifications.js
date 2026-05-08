import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  async function refresh() {
    if (!userId) return;
    setNotifications(await api.getNotifications(userId));
  }
  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("calmy-db-update", onUpdate);
    const id = setInterval(refresh, 5000);
    return () => { window.removeEventListener("calmy-db-update", onUpdate); clearInterval(id); };
  }, [userId]);
  const unread = notifications.filter(n => !n.read).length;
  return { notifications, unread, refresh };
}
