// LoadingBar.tsx
import { useState, useEffect } from "react";

const LoadingBar = () => {
  const blocks = Array.from({ length: 14 }); // 총 블록 수
  const [filledBlocks, setFilledBlocks] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilledBlocks((prev) => {
        if (prev >= blocks.length) {
          return 0; // 다시 처음부터 시작
        }
        return prev + 1;
      });
    }, 100); // 200ms마다 한 블록씩 채움

    return () => clearInterval(interval);
  }, [blocks.length]);

  return (
    <div className=" bg-black flex items-center justify-center">
      <div className="border-2 border-white rounded-xl -mt-25 bg-transparent px-1.5 py-1 flex gap-1">
        {blocks.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-5 transition-colors duration-300 ${
              i < filledBlocks ? "bg-red-600" : "bg-transparent"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingBar;
