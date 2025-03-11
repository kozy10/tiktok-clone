"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/lib/data/types";
import VideoPlayer from "./VideoPlayer";

interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(() => {
    const initialLoadedVideos = new Set([videos[0]?.id]);
    if (videos[1]?.id) initialLoadedVideos.add(videos[1].id);
    if (videos[2]?.id) initialLoadedVideos.add(videos[2].id);
    return initialLoadedVideos;
  });
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

        // Preload the next two videos
        for (let i = 1; i <= 2; i++) {
          if (index + i < videos.length) {
            setLoadedVideos((prev) => new Set([...prev, videos[index + i].id]));
          }
        }

        // Preload the previous two videos
        for (let i = 1; i <= 2; i++) {
          if (index - i >= 0) {
            setLoadedVideos((prev) => new Set([...prev, videos[index - i].id]));
          }
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
      className="h-screen overflow-y-scroll snap-y snap-mandatory overscroll-y-contain"
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen w-full snap-start snap-always relative overflow-hidden"
        >
          {/* Only render the current video and adjacent videos (2 in each direction) to optimize performance */}
          {(loadedVideos.has(video.id) ||
            index === activeVideoIndex ||
            index === activeVideoIndex + 1 ||
            index === activeVideoIndex + 2 ||
            index === activeVideoIndex - 1 ||
            index === activeVideoIndex - 2) && (
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
