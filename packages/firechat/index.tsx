import { useEffect, useState } from "react";
import { Database, onValue, ref, set } from "firebase/database";

type ChatRoomID = string;
type ChatCategory = string;
type ChatAuthorID = string;
type ChatMessageReaction = string;
type Timestamp = number;

async function sendMessage({
  db,
  message,
  author,
  chatId,
  chatCategory,
}: {
  db: Database;
  message: string;
  author: ChatAuthorID;
  chatId: ChatRoomID;
  chatCategory: ChatCategory;
}) {
  const timestamp = Date.now();
  await set(ref(db, `chats/${chatCategory}/${chatId}/messages/${timestamp}`), {
    author,
    message,
  });
}

async function reactToMessage({
  db,
  reaction,
  author,
  chatId,
  chatCategory,
  messageTimestamp,
}: {
  db: Database;
  reaction: ChatMessageReaction;
  author: ChatAuthorID;
  chatId: ChatRoomID;
  chatCategory: ChatCategory;
  messageTimestamp: Timestamp;
}) {
  const timestamp = Date.now();
  await set(
    ref(
      db,
      `chats/${chatCategory}/${chatId}/messages/${messageTimestamp}/reactions/${reaction}/${author}`
    ),
    timestamp
  );
}

export interface ChatReactions {
  [key: ChatMessageReaction]: {
    [key: ChatAuthorID]: Timestamp;
  };
}

export interface ChatMessage {
  author: ChatAuthorID;
  message: string;
  timestamp: Timestamp;
  reactions: ChatReactions;
}

export default function useChat({
  db,
  chatCategory = "general",
  chatId,
  author,
}: {
  /**
   * Instance of firebase realtime database
   */
  db: Database;
  /**
   * Unique identifier for the chat room
   */
  chatId: ChatRoomID;
  /**
   * Category of the chat room. Eg. "p2p", "classroom", "session"
   */
  chatCategory?: ChatCategory;
  /**
   * A unique ID of the author.
   */
  author: ChatAuthorID;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const send = (message: string) =>
    sendMessage({ db, message, author, chatId, chatCategory });

  const react = (reaction: ChatMessageReaction, messageTimestamp: Timestamp) =>
    reactToMessage({
      db,
      reaction,
      author,
      chatId,
      chatCategory,
      messageTimestamp,
    });

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

  return {
    /**
     * List of messages in the chat room.
     */
    messages,
    /**
     * Send a message to the chat room.
     */
    send,
    /**
     * React to a message.
     */
    react,
  };
}
