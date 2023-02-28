import { useEffect, useState } from "react";
import { Database, onValue, ref, set } from "firebase/database";

async function sendMessage({
  db,
  message,
  user,
  chatId,
  chatCategory = "general",
}: {
  db: Database;
  message: string;
  user: string;
  chatId: string;
  chatCategory: string;
}) {
  const timestamp = Date.now();
  await set(ref(db, `chats/${chatCategory}/${chatId}/messages/${timestamp}`), {
    user,
    message,
  });
}

export interface ChatMessage {
  user: string;
  message: string;
  timestamp: number;
}

interface Props {
  db: Database;
  chatId: string;
  chatCategory?: string;
  user: string;
}

export default function useChat({
  db,
  chatCategory = "general",
  chatId,
  user,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const send = (message: string) =>
    sendMessage({ db, message, user, chatId, chatCategory });

  useEffect(() => {
    onValue(ref(db, `chats/${chatCategory}/${chatId}/messages`), (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const messages = Object.entries(data).map(
        ([timestamp, message]: any) => ({
          ...message,
          timestamp: Number(timestamp),
        })
      );

      setMessages(messages);
    });
  }, [db, chatCategory, chatId]);

  return { messages, send, chatId };
}
