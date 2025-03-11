"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/lib/data/types";
import VideoPlayer from "./VideoPlayer";

interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(
    new Set()
  );
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);
  const videoElementsRef = useRef<Record<string, HTMLVideoElement>>({});

  // プレビュー画像をプリロードする関数
  const preloadImage = (imageUrl: string) => {
    if (!imageUrl || preloadedImages.has(imageUrl)) return;

    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setPreloadedImages((prev) => new Set([...prev, imageUrl]));
    };
  };

  // 動画をプリロードする関数
  const preloadVideo = (videoUrl: string, videoId: string) => {
    if (!videoUrl || preloadedVideos.has(videoUrl)) return;

    // 既存の動画要素があれば再利用し、なければ新規作成
    let videoElement = videoElementsRef.current[videoId];

    if (!videoElement) {
      videoElement = document.createElement("video");
      videoElement.preload = "auto";
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.style.display = "none";
      videoElementsRef.current[videoId] = videoElement;
      document.body.appendChild(videoElement);
    }

    // 新しいsrcをセット
    videoElement.src = videoUrl;

    // データをプリロード
    videoElement.load();

    // プリロード済みとしてマーク
    setPreloadedVideos((prev) => new Set([...prev, videoUrl]));
  };

  // 動画リソースを解放する関数（メモリ管理のため）
  const releaseVideo = (videoId: string) => {
    const videoElement = videoElementsRef.current[videoId];
    if (videoElement) {
      videoElement.src = "";
      document.body.removeChild(videoElement);
      delete videoElementsRef.current[videoId];
    }
  };

  // 前後の動画のプリロード
  useEffect(() => {
    // アクティブな動画が変わったら、前後の動画をプリロード
    if (activeVideoIndex >= 0) {
      // 前の2つの動画をプリロード
      for (let i = 1; i <= 2; i++) {
        if (activeVideoIndex - i >= 0) {
          const prevVideo = videos[activeVideoIndex - i];
          if (prevVideo.previewUrl) {
            preloadImage(prevVideo.previewUrl);
          }
          if (prevVideo.url) {
            preloadVideo(prevVideo.url, prevVideo.id);
          }
        }
      }

      // 次の2つの動画をプリロード
      for (let i = 1; i <= 2; i++) {
        if (activeVideoIndex + i < videos.length) {
          const nextVideo = videos[activeVideoIndex + i];
          if (nextVideo.previewUrl) {
            preloadImage(nextVideo.previewUrl);
          }
          if (nextVideo.url) {
            preloadVideo(nextVideo.url, nextVideo.id);
          }
        }
      }

      // 現在の動画から遠い動画のリソースを解放（メモリ管理のため）
      videos.forEach((video, index) => {
        if (Math.abs(index - activeVideoIndex) > 3) {
          releaseVideo(video.id);
        }
      });
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
              isPreloaded={video.url ? preloadedVideos.has(video.url) : false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
