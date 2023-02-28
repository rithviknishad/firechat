import { Database, ref, set } from "firebase/database";

interface Props {
  db: Database;
  message: string;
  user: string;
  chatId: string;
  chatCategory: string;
}

export default async function sendMessage({
  db,
  message,
  user,
  chatId,
  chatCategory = "general",
}: Props) {
  const timestamp = Date.now();
  await set(ref(db, `chats/${chatCategory}/${chatId}/messages/${timestamp}`), {
    user,
    message,
  });
}
