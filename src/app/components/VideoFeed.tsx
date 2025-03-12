"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/lib/data/types";
import VideoPlayer from "./VideoPlayer";

interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  // Scroll detection and active video determination
  useEffect(() => {
    const feedContainer = feedContainerRef.current;
    if (!feedContainer) return;

    const handleScroll = () => {
      // スクロール方向を検出
      const currentScrollTop = feedContainer.scrollTop;
      lastScrollTopRef.current = currentScrollTop;

      // スクロール中は頻繁な状態更新を避けるためにデバウンス
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const containerHeight = feedContainer.clientHeight;
        const containerScrollTop = feedContainer.scrollTop;

        // 現在のビューポートに表示されている動画のインデックスを計算
        const currentIndex = Math.floor(containerScrollTop / containerHeight);

        // 次のビデオがどのくらい表示されているか計算
        const nextIndex = currentIndex + 1;
        const currentVideoVisiblePart =
          (currentIndex + 1) * containerHeight - containerScrollTop;
        const currentVideoVisiblePercentage =
          (currentVideoVisiblePart / containerHeight) * 100;
        const nextVideoVisiblePercentage = 100 - currentVideoVisiblePercentage;

        // 次の動画が30%以上表示されていれば、次の動画をアクティブにする
        const targetIndex =
          nextVideoVisiblePercentage >= 30 ? nextIndex : currentIndex;

        if (
          targetIndex !== activeVideoIndex &&
          targetIndex >= 0 &&
          targetIndex < videos.length
        ) {
          setActiveVideoIndex(targetIndex);
        }
      }, 100); // 100msのデバウンス
    };

    // 初期ロード時にスクロールイベントを発火させて、プリロードを開始
    handleScroll();

    feedContainer.addEventListener("scroll", handleScroll);
    return () => {
      feedContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeVideoIndex, videos]);

  return (
    <div
      ref={feedContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory overscroll-y-contain bg-transparent"
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen w-full snap-start snap-always relative overflow-hidden flex items-center justify-center bg-transparent"
        >
          <div className="w-full h-full max-w-[500px] mx-auto bg-transparent">
            <VideoPlayer
              video={video}
              isActive={index === activeVideoIndex}
              isPreloaded={index === activeVideoIndex + 1}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
