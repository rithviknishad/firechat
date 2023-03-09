import { useEffect, useState } from "react";
import {
  Database,
  onValue,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";

declare type ChatRoomID = string;
declare type ChatCategory = string;
declare type ChatAuthorID = string;
declare type Reaction = string;
declare type Timestamp = number;

export declare interface ChatMessageReactions {
  [key: Reaction]: {
    [key: ChatAuthorID]: Timestamp;
  };
}

export declare interface ChatMessage {
  author: ChatAuthorID;
  message: string;
  timestamp: Timestamp;
  reactions: ChatMessageReactions;
  meta?: object;
}

declare interface AuthorsLastTyping {
  [author: ChatAuthorID]: Timestamp;
}

const getTypingAuthors = (authors: AuthorsLastTyping, timeout: number) => {
  const now = Date.now();
  const typingAuthors = Object.entries(authors).reduce(
    (acc, [author, timestamp]) => {
      if (now - timestamp < timeout) {
        acc.push(author);
      }
      return acc;
    },
    [] as ChatAuthorID[]
  );
  return typingAuthors;
};

/**
 * React hook to use FireChat.
 */
const useFireChat = ({
  db,
  chatCategory = "general",
  chatId,
  author,
  typingTimeout = 3000,
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
  /**
   * Time in milliseconds after which the typing notification is removed.
   */
  typingTimeout?: number;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [authorsLastTyping, setAuthorsLastTyping] = useState<AuthorsLastTyping>(
    {}
  );
  const [typingAuthors, setTypingAuthors] = useState<ChatAuthorID[]>([]);

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

    onValue(ref(db, `chats/${chatCategory}/${chatId}/members`), (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const authorsLastTyping = Object.entries(data).reduce(
        (acc, [member, { typing }]: any) => {
          if (member !== author && typing) {
            acc[member] = typing;
          }
          return acc;
        },
        {}
      );

      setAuthorsLastTyping(authorsLastTyping);
      setTypingAuthors(getTypingAuthors(authorsLastTyping, typingTimeout));
    });
  }, [db, chatCategory, chatId]);

  useEffect(() => {
    const id = setInterval(() => {
      setTypingAuthors(getTypingAuthors(authorsLastTyping, typingTimeout));
    }, 1000);

    return () => clearInterval(id);
  }, [authorsLastTyping, typingTimeout]);

  return {
    /**
     * List of messages in the chat room.
     */
    messages,

    /**
     * List of authors who are currently typing.
     */
    typingAuthors,

    /**
     * Send a message to the chat room.
     * @param message Message to send
     */
    send: async (message: string, meta?: object) => {
      const timestamp = Date.now();
      await set(
        ref(db, `chats/${chatCategory}/${chatId}/messages/${timestamp}`),
        meta ? { author, message, meta } : { author, message }
      );
    },

    /**
     * React to a message.
     * @param reaction The reaction to add/remove
     * @param messageTimestamp  The timestamp of the message to react to
     * @param removeReaction Whether to remove the reaction instead of adding it
     */
    react: async (
      reaction: Reaction,
      messageTimestamp: Timestamp,
      removeReaction = false
    ) => {
      await set(
        ref(
          db,
          `chats/${chatCategory}/${chatId}/messages/${messageTimestamp}/reactions/${reaction}/${author}`
        ),
        removeReaction ? null : serverTimestamp()
      );
    },

    notifyTyping: async (isTyping = true) => {
      await set(
        ref(db, `chats/${chatCategory}/${chatId}/members/${author}/typing`),
        isTyping ? serverTimestamp() : null
      );
    },
  };
};

export default useFireChat;
