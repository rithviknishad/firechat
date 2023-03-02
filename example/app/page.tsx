import HomeOptions from "./HomeOptions";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen max-w-3xl mx-auto p-8 gap-16">
      <div className="font-display text-yellow-400 text-center">
        <h1 className="text-6xl">firechat</h1>
        <span className="text-xl">
          A simple chat client for react using firebase realtime database.
        </span>
      </div>

      <HomeOptions />

      <div className="font-mono hover:underline transition-all duration-200 ease-in-out">
        <a href="https://github.com/rithviknishad/firechat">
          <span className="text-gray-400">{"github.com/"}</span>
          <span className="text-white">{"rithviknishad/firechat"}</span>
        </a>
      </div>
    </div>
  );
}
