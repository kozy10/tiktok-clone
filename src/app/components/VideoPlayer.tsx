"use client";

import { useEffect, useRef, useState } from "react";
import { Video as VideoType } from "@/lib/data/types";

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  isPreloaded?: boolean;
}

export default function VideoPlayer({
  video,
  isActive,
  isPreloaded = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 動画の読み込みを最適化
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 非アクティブな動画はロード優先度を下げる
    if (!isActive) {
      videoElement.preload = isPreloaded ? "auto" : "metadata";
      // 非アクティブになったらプレビュー状態をリセット
      setIsLoaded(false);
    } else {
      videoElement.preload = "auto";
      // モバイルでの自動再生を強制
      videoElement.load();
    }
  }, [isActive, isPreloaded]);

  // メイン動画の再生管理
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    console.log("Current readyState:", videoElement.readyState);

    // 動画のロード状態が変化したときに再生を試みる関数
    const handleCanPlay = () => {
      if (isActive && videoElement.readyState >= 3) {
        console.log("Video can play, readyState:", videoElement.readyState);
        videoElement
          .play()
          .then(() => {
            console.log("Video playback started successfully");
            setIsLoaded(true);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      }
    };

    if (isActive) {
      // 読み込み状態のイベントリスナーを追加
      videoElement.addEventListener("canplay", handleCanPlay);

      // すでに読み込み完了状態なら再生を試みる
      if (videoElement.readyState >= 3) {
        handleCanPlay();
      } else {
        videoElement.load();
      }
    } else {
      videoElement.pause();
      // Reset to the beginning so it can be played from the start when scrolled back
      videoElement.currentTime = 0;
    }

    // クリーンアップ関数
    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <div className="relative w-[80%] h-[80%] overflow-hidden rounded-2xl shadow-lg">
        <video
          ref={videoRef}
          src={video.url}
          className={`w-full h-full object-cover rounded-2xl`}
          loop
          muted
          playsInline
          poster={video.previewUrl}
          preload={isActive ? "auto" : isPreloaded ? "auto" : "none"}
        />

        {/* User information and video description */}
        <div className="absolute bottom-6 left-4 right-4 z-10 flex flex-col text-white pb-safe">
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
            <p className="text-sm max-w-[90%] mb-2">{video.description}</p>
          )}
          <p className="text-xs text-gray-300 max-w-[90%]">{video.url}</p>
        </div>

        {/* Loading indicator - only show if no preview image is available */}
        {!isLoaded && !video.previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
