import { useEffect, useRef, useState, useCallback } from "react";
import {
  getMessagesService,
  getUsersService,
  sendMessageService,
} from "../services/chatService";

const BASE_URL = "http://localhost:3000";

function useChat(myId) {
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const sseRef = useRef(null);
  const targetUserRef = useRef(null);

  // Keep ref in sync so SSE handler always has latest targetUser
  useEffect(() => {
    targetUserRef.current = targetUser;
  }, [targetUser]);

  const connectSSE = useCallback(() => {
    if (!myId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    // Close existing connection
    if (sseRef.current) {
      sseRef.current.close();
    }

    const url = `${BASE_URL}/api/chat/sse`;
    const source = new EventSource(`${url}?token=${token}`);

    source.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        // Only append if message is from/to the currently open conversation
        const current = targetUserRef.current;
        if (
          current &&
          (payload.from === current.id || payload.to === current.id)
        ) {
          setMessages((prev) => {
            // Avoid duplicate if we already added it optimistically on send
            const alreadyExists = prev.some(
              (m) =>
                m.isi_pesan === payload.text &&
                m.sender_id === payload.from &&
                Math.abs(new Date(m.waktu) - new Date(payload.time)) < 5000
            );
            if (alreadyExists) return prev;
            return [
              ...prev,
              {
                pesan_id: Date.now(),
                sender_id: payload.from,
                receiver_id: payload.to,
                isi_pesan: payload.text,
                waktu: payload.time,
              },
            ];
          });
        }
        // Refresh user list to update last_message previews
        loadUsers(false);
      } catch (_) {}
    };

    source.onerror = () => {
      source.close();
      // Reconnect after 3s
      setTimeout(() => connectSSE(), 3000);
    };

    sseRef.current = source;
  }, [myId]);

  async function loadUsers(showLoading = true) {
    try {
      if (showLoading) setUsersLoading(true);
      const result = await getUsersService();
      setUsers(result);

      const savedTargetId = Number(localStorage.getItem("targetChatId"));
      setTargetUser((prev) => {
        if (prev) {
          // Update last_message for current targetUser from fresh list
          const updated = result.find((u) => u.id === prev.id);
          return updated || prev;
        }
        if (savedTargetId) {
          const saved = result.find((u) => Number(u.id) === savedTargetId);
          if (saved) return saved;
        }
        return null;
      });
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
    } finally {
      if (showLoading) setUsersLoading(false);
    }
  }

  async function loadMessages(targetId) {
    if (!targetId) return;
    setLoading(true);
    try {
      const result = await getMessagesService(targetId);
      setMessages(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("LOAD MESSAGES ERROR:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(text) {
    if (!targetUser?.id || !text.trim()) return false;
    const trimmed = text.trim();

    // Optimistic update
    const optimistic = {
      pesan_id: `opt_${Date.now()}`,
      sender_id: myId,
      receiver_id: targetUser.id,
      isi_pesan: trimmed,
      waktu: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await sendMessageService(targetUser.id, trimmed);
      return true;
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      // Remove optimistic message on failure
      setMessages((prev) =>
        prev.filter((m) => m.pesan_id !== optimistic.pesan_id)
      );
      return false;
    }
  }

  function chooseUser(user) {
    setTargetUser(user);
    localStorage.setItem("targetChatId", String(user.id));
  }

  useEffect(() => {
    if (myId) {
      loadUsers();
      connectSSE();
    }
    return () => {
      if (sseRef.current) sseRef.current.close();
    };
  }, [myId, connectSSE]);

  useEffect(() => {
    if (targetUser?.id) loadMessages(targetUser.id);
    else setMessages([]);
  }, [targetUser?.id]);

  return {
    users,
    targetUser,
    messages,
    loading,
    usersLoading,
    sendMessage,
    chooseUser,
  };
}

export { useChat };
