"use client";

import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";

export default function HomeOptions() {
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      <form
        className="flex gap-3 items-center w-full"
        onSubmit={(e: any) => {
          e.preventDefault();
          const chatId = e.target.chat_id.value;

          if (chatId) {
            window.location.href = `/chat/${chatId}`;
          }
        }}
      >
        <input
          name="chat_id"
          className="w-full rounded-lg py-2 px-3 border border-white focus:outline-none focus:ring-0 focus:border-yellow-400 bg-inherit focus:shadow-2xl focus:shadow-yellow-400 focus:-translate-y-0.5 transition-all duration-200 ease-in-out font-mono tracking-wider"
          placeholder="Enter chat room ID to join"
        />
        <button className="rounded-lg flex items-center justify-center text-center gap-2 py-2 px-3 border border-yellow-400 bg-yellow-400 hover:bg-inherit text-black hover:text-inherit transition-all duration-200 ease-in-out whitespace-nowrap">
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
          Join
        </button>
      </form>
      <button
        className="rounded-lg flex items-center justify-center text-center gap-2 py-2 px-3 border border-yellow-400 bg-yellow-400 hover:bg-inherit text-black hover:text-inherit transition-all duration-200 ease-in-out whitespace-nowrap"
        onClick={() => {
          const chatId = uuidv4();
          window.location.href = `/chat/${chatId}`;
        }}
      >
        <ChatBubbleBottomCenterIcon className="w-5 h-5" />
        <span>Create a chat room</span>
      </button>
    </div>
  );
}
