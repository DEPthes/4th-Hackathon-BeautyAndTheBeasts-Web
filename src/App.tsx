import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="flex gap-8 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img
            src={reactLogo}
            className="h-24 w-24 animate-spin"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Vite + React + Tailwind v4
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-300 text-center">
          Edit{" "}
          <code className="bg-gray-700 px-2 py-1 rounded text-blue-300">
            src/App.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-gray-400 text-sm mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
