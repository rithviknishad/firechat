import { useEffect, useState } from "react";
import { Database, onValue, ref } from "firebase/database";

import {
  ChatAuthorID,
  ChatCategory,
  ChatMessage,
  ChatMessageReaction,
  ChatRoomID,
  Timestamp,
} from "./types";
import { reactToMessage, sendMessage } from "./utils";

/**
 * React hook to use FireChat.
 */
export const useFireChat = ({
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
}) => {
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
};
