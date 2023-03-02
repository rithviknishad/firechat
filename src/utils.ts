import { ref, set, Database } from "firebase/database";
import {
  ChatAuthorID,
  ChatCategory,
  ChatMessageReaction,
  ChatRoomID,
  Timestamp,
} from "./types";

export async function sendMessage({
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

export async function reactToMessage({
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
