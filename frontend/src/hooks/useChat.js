import { useEffect, useState } from "react";
import {
  getMessagesService,
  getUsersService,
  sendMessageService
} from "../services/chatService";

function useChat(myId) {
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [messages, setMessages] = useState([]);

  async function loadUsers() {
    try {
      const result = await getUsersService();
      setUsers(result);
      const savedTargetId = Number(localStorage.getItem("targetChatId"));
      if (result.length > 0) {
        const selectedUser = result.find((user) => Number(user.id) === savedTargetId) || result[0];
        setTargetUser((prev) => prev || selectedUser);
      }
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
    }
  }

  async function loadMessages(targetId) {
    if (!targetId) return;
    try {
      const result = await getMessagesService(targetId);
      setMessages(result);
    } catch (error) {
      console.error("LOAD MESSAGES ERROR:", error);
    }
  }

  async function sendMessage(text) {
    if (!targetUser?.id || !text.trim()) return false;
    try {
      const savedMessage = await sendMessageService(targetUser.id, text.trim());
      setMessages((prev) => [...prev, savedMessage]);
      return true;
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      return false;
    }
  }

  function chooseUser(user) {
    setTargetUser(user);
    localStorage.setItem("targetChatId", String(user.id));
  }

  useEffect(() => {
    if (myId) loadUsers();
  }, [myId]);

  useEffect(() => {
    if (targetUser?.id) loadMessages(targetUser.id);
  }, [targetUser?.id]);

  return { users, targetUser, messages, sendMessage, chooseUser };
}

export { useChat };
