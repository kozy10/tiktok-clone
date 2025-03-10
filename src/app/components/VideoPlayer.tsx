"use client";

import { useEffect, useRef, useState } from "react";
import { Video as VideoType } from "@/lib/data/types";

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  onLoad?: () => void;
}

export default function VideoPlayer({
  video,
  isActive,
  onLoad,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Play the video when it enters the viewport and pause it when it leaves
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      videoElement.pause();
      // Reset to the beginning so it can be played from the start when scrolled back
      videoElement.currentTime = 0;
    }
  }, [isActive]);

  // Processing when video loading is complete
  const handleLoadedData = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
      />

      {/* User information and video description */}
      <div className="absolute bottom-6 left-4 z-10 flex flex-col text-white">
        <div className="flex items-center mb-2">
          {video.userAvatar && (
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img
                src={video.userAvatar}
                alt={video.userName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="font-semibold">{video.userName}</span>
        </div>

        {video.description && (
          <p className="text-sm max-w-[80%]">{video.description}</p>
        )}
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
