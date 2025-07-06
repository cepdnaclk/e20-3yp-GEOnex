const Loading = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(47,47,48,1)" }}
    >
      {/* GEOnex word-mark */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-wide font-light text-white">
        <span className="font-semibold">GEO</span>nex
      </h1>

      {/* animated dots */}
      <div className="flex gap-1 mt-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="dot text-white/80"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          >
            .
          </span>
        ))}
      </div>
    </div>
  );
};



export default Loading;
