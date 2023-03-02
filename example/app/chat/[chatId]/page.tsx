"use client";

import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { Database, getDatabase } from "firebase/database";
import Image from "next/image";
import { app } from "./firebase";
import useFireChat, { ChatMessage } from "@rithviknishad/firechat";

export default function Page({ params }: { params: { chatId: string } }) {
  const [username, setUsername] = useState("");
  const [db, setDb] = useState<Database>();

  useEffect(() => {
    setDb(getDatabase(app));

    const username = prompt(
      "What's your GitHub username?",
      localStorage.getItem("username") || ""
    );
    setUsername(username || "");
    localStorage.setItem("username", username || "");
  }, []);

  if (!username || !db) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center mx-auto bg-slate-800 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <Chat
      db={db}
      author={username}
      chatId={params.chatId}
      chatCategory="public"
    />
  );
}

interface Props {
  db: Database;
  author: string;
  chatId: string;
  chatCategory: string;
}

const Chat = (props: Props) => {
  const { messages, send, typingAuthors, notifyTyping } = useFireChat(props);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-screen items-center gap-4 w-full max-w-3xl mx-auto p-8">
      <div className="font-mono text-yellow-400 tracking-wider uppercase">
        Chat #{props.chatId}
      </div>
      <div className="flex flex-col gap-2 w-full h-full">
        {messages.map((message, index) => (
          <ChatMessageTile key={index} {...message} />
        ))}
      </div>
      <MessageInput
        githubUsername={props.author}
        value={message}
        onChange={(message) => {
          notifyTyping(!!message);
          setMessage(message);
        }}
        onSubmit={() => send(message)}
      />
      {typingAuthors.length > 0 && (
        <span className="text-zinc-600 text-xs">
          {typingAuthors.join(", ")} is typing...
        </span>
      )}
    </div>
  );
};

const ChatMessageTile = (props: ChatMessage) => {
  return (
    <div className="flex gap-2 w-full hover:bg-zinc-900 transition-all duration-200 ease-in-out p-2 rounded-lg">
      <div className="flex-shrink-0">
        <Image
          height={32}
          width={32}
          className="inline-block h-8 w-8 rounded-full"
          src={`https://github.com/${props.author}.png`}
          alt={props.author + "'s avatar"}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-300">
            {props.author}
          </div>
          <div className="text-sm text-slate-500">
            {new Date(props.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="mt-1 text-sm text-slate-100">{props.message}</div>
      </div>
    </div>
  );
};
