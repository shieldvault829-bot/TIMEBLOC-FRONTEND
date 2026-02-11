'use client';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Unique rotating rings */}
        <div className="relative mx-auto mb-8" style={{ width: 120, height: 120 }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2"
              style={{
                width: `${20 + i * 12}px`,
                height: `${20 + i * 12}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                borderColor: `hsl(${i * 45}, 100%, 50%)`,
                animation: `spin ${1 + i * 0.2}s linear infinite`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.7 - (i * 0.07)
              }}
            />
          ))}
        </div>
        
        <div className="text-white text-lg font-semibold mb-2">
          TimeBloc
        </div>
        <div className="text-gray-400 text-sm">
          Loading secure platform...
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;