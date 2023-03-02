import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (message: string) => void;
  onSubmit: () => void;
  githubUsername: string;
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  githubUsername,
}: Props) {
  return (
    <div className="flex items-start space-x-4 w-full">
      <div className="flex-shrink-0">
        <Image
          height={40}
          width={40}
          className="inline-block rounded-full"
          src={`https://github.com/${githubUsername}.png`}
          alt={`${githubUsername}'s avatar`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="overflow-hidden rounded-lg border border-gray-700 shadow-sm focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400">
            <label htmlFor="comment" className="sr-only">
              Add your message
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 p-3 ring-0 focus:ring-0 outline-none focus:outline-none sm:text-sm bg-transparent focus:bg-zinc-900 transition-all duration-200 ease-in-out"
              placeholder="Add your comment..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="py-2" aria-hidden="true">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="text-sm rounded-lg flex items-center justify-center text-center gap-2 py-1 px-2 border border-yellow-400 bg-yellow-400 hover:bg-inherit text-black hover:text-inherit transition-all duration-200 ease-in-out whitespace-nowrap"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
