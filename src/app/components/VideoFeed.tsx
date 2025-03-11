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
    // 初期ロード時により多くの動画をプリロード
    const initialLoadedVideos = new Set<string>();
    // 最初の3つの動画を初期ロード時にプリロード
    for (let i = 0; i < Math.min(3, videos.length); i++) {
      if (videos[i]?.id) initialLoadedVideos.add(videos[i].id);
    }
    return initialLoadedVideos;
  });
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  // プレビュー画像をプリロードする関数
  const preloadImage = (imageUrl: string) => {
    if (!imageUrl || preloadedImages.has(imageUrl)) return;

    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setPreloadedImages((prev) => new Set([...prev, imageUrl]));
    };
  };

  // 次の動画のプレビュー画像をプリロード
  useEffect(() => {
    // アクティブな動画が変わったら、次の動画のプレビュー画像をプリロード
    if (activeVideoIndex >= 0) {
      // 次の3つの動画のプレビュー画像をプリロード
      for (let i = 1; i <= 3; i++) {
        if (activeVideoIndex + i < videos.length) {
          const nextVideo = videos[activeVideoIndex + i];
          if (nextVideo.previewUrl) {
            preloadImage(nextVideo.previewUrl);
          }
          if (nextVideo.coverImage) {
            preloadImage(nextVideo.coverImage);
          }
        }
      }
    }
  }, [activeVideoIndex, videos]);

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

        // Calculate the index of the currently displayed video
        const index = Math.floor(containerScrollTop / containerHeight);
        if (index !== activeVideoIndex && index >= 0 && index < videos.length) {
          setActiveVideoIndex(index);

          // より多くの次の動画をプリロード (2つに増加)
          for (let i = 1; i <= 2; i++) {
            if (index + i < videos.length) {
              setLoadedVideos(
                (prev) => new Set([...prev, videos[index + i].id])
              );
            }
          }

          // 前の動画もプリロード (1つに増加)
          for (let i = 1; i <= 1; i++) {
            if (index - i >= 0) {
              setLoadedVideos(
                (prev) => new Set([...prev, videos[index - i].id])
              );
            }
          }
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

  // Callback when a video is loaded
  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set([...prev, videoId]));
  };

  // 前後の動画を取得する関数
  const getPrevVideo = (index: number): Video | undefined => {
    return index > 0 ? videos[index - 1] : undefined;
  };

  const getNextVideo = (index: number): Video | undefined => {
    return index < videos.length - 1 ? videos[index + 1] : undefined;
  };

  // 表示すべき動画かどうかを判定する関数
  const shouldRenderVideo = (index: number): boolean => {
    // アクティブな動画の後ろ2つ前1つまでの動画を表示
    const isNearActive =
      index === activeVideoIndex ||
      index === activeVideoIndex + 1 ||
      index === activeVideoIndex + 2 ||
      index === activeVideoIndex - 1;

    // すでにロード済みの動画も表示
    return isNearActive || loadedVideos.has(videos[index].id);
  };

  // プリロードする動画の数を増やす
  useEffect(() => {
    // アクティブな動画が変わったら、次の動画をプリロード
    if (activeVideoIndex >= 0) {
      // 次の3つの動画をプリロード
      for (let i = 1; i <= 3; i++) {
        if (activeVideoIndex + i < videos.length) {
          setLoadedVideos(
            (prev) => new Set([...prev, videos[activeVideoIndex + i].id])
          );
        }
      }

      // 前の1つの動画もプリロード
      if (activeVideoIndex - 1 >= 0) {
        setLoadedVideos(
          (prev) => new Set([...prev, videos[activeVideoIndex - 1].id])
        );
      }
    }
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
            {shouldRenderVideo(index) && (
              <>
                {/* 前の動画 */}
                {index === activeVideoIndex && getPrevVideo(index) && (
                  <div className="hidden">
                    <VideoPlayer
                      video={getPrevVideo(index)!}
                      isActive={false}
                      onLoad={() => handleVideoLoad(getPrevVideo(index)!.id)}
                    />
                  </div>
                )}

                {/* 現在の動画 */}
                <VideoPlayer
                  video={video}
                  isActive={index === activeVideoIndex}
                  onLoad={() => handleVideoLoad(video.id)}
                />

                {/* 次の動画 */}
                {index === activeVideoIndex && getNextVideo(index) && (
                  <div className="hidden">
                    <VideoPlayer
                      video={getNextVideo(index)!}
                      isActive={false}
                      onLoad={() => handleVideoLoad(getNextVideo(index)!.id)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
