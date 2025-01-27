import { useEffect, useState } from "react";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="relative w-48 h-48 mb-8">
        <img
          src="/lovable-uploads/42e0020a-081c-4503-8b31-1eeda06e5aa1.png"
          alt="FUTO Logo"
          className="w-full h-full object-contain animate-scale-in"
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary animate-pulse rounded-full" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-primary animate-slide-in">
        FUTO CGPA Calculator
      </h1>
    </div>
  );
};

export default LoadingScreen;