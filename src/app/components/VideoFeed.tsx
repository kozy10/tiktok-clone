"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/lib/data/types";
import VideoPlayer from "./VideoPlayer";

interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(
    new Set([videos[0]?.id])
  );
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Scroll detection and active video determination
  useEffect(() => {
    const feedContainer = feedContainerRef.current;
    if (!feedContainer) return;

    const handleScroll = () => {
      const containerHeight = feedContainer.clientHeight;
      const containerScrollTop = feedContainer.scrollTop;

      // Calculate the index of the currently displayed video
      const index = Math.floor(containerScrollTop / containerHeight);
      if (index !== activeVideoIndex && index >= 0 && index < videos.length) {
        setActiveVideoIndex(index);

        // Preload the next video
        if (index + 1 < videos.length) {
          setLoadedVideos((prev) => new Set([...prev, videos[index + 1].id]));
        }

        // Preload the previous video (considering the possibility of the user scrolling up)
        if (index - 1 >= 0) {
          setLoadedVideos((prev) => new Set([...prev, videos[index - 1].id]));
        }
      }
    };

    feedContainer.addEventListener("scroll", handleScroll);
    return () => {
      feedContainer.removeEventListener("scroll", handleScroll);
    };
  }, [activeVideoIndex, videos]);

  // Callback when a video is loaded
  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set([...prev, videoId]));
  };

  return (
    <div
      ref={feedContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen w-full snap-start snap-always relative"
        >
          {/* Only render the current video and adjacent videos to optimize performance */}
          {(loadedVideos.has(video.id) ||
            index === activeVideoIndex ||
            index === activeVideoIndex + 1 ||
            index === activeVideoIndex - 1) && (
            <VideoPlayer
              video={video}
              isActive={index === activeVideoIndex}
              onLoad={() => handleVideoLoad(video.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
