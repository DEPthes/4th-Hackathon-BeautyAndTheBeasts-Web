// LoadingBar.tsx
const LoadingBar = () => {
  const blocks = Array.from({ length: 14 }); // 총 블록 수

  return (
    <div className=" bg-black flex items-center justify-center">
      <div className="border-2 border-white -mt-20 bg-transparent px-1 py-1 flex gap-1">
        {blocks.map((_, i) => (
          <div
            key={i}
            className="w-4 h-6 bg-red-500 animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "2s",
              animationIterationCount: "infinite",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingBar;
