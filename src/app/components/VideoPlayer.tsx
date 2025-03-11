"use client";

import { useEffect, useRef, useState } from "react";
import { Video as VideoType } from "@/lib/data/types";
import Image from "next/image";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // 動画の読み込みを最適化
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 非アクティブな動画はロード優先度を下げる
    if (!isActive) {
      videoElement.preload = "metadata";
      // 非アクティブになったらプレビュー状態をリセット
      setShowPreview(true);
      setIsLoaded(false);
      setIsPlaying(false);
    } else {
      videoElement.preload = "auto";

      // モバイルでの自動再生を強制
      videoElement.load();
    }
  }, [isActive]);

  // プレビュー動画の管理
  useEffect(() => {
    if (!isActive) return;

    // アクティブになったときにプレビュー画像を表示
    setShowPreview(true);

    return () => {
      // 非アクティブになったときにクリーンアップ
    };
  }, [isActive]);

  // メイン動画の再生管理
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      // 再生を試みる前に、動画が十分に読み込まれているか確認
      if (videoElement.readyState >= 3) {
        // HAVE_FUTURE_DATA以上の状態
        playVideo(videoElement);
      } else {
        // まだ十分なデータがない場合は、データが来るのを待つ
        const handleCanPlay = () => {
          // 少し遅延させて再生を開始することでバッファリングを確保
          setTimeout(() => {
            playVideo(videoElement);
          }, 100);
          videoElement.removeEventListener("canplaythrough", handleCanPlay);
        };
        videoElement.addEventListener("canplaythrough", handleCanPlay);
        return () => {
          videoElement.removeEventListener("canplaythrough", handleCanPlay);
        };
      }
    } else {
      videoElement.pause();
      setIsPlaying(false);
      // Reset to the beginning so it can be played from the start when scrolled back
      videoElement.currentTime = 0;
    }
  }, [isActive]);

  // 動画再生を試みる関数
  const playVideo = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play();
      setIsPlaying(true);

      // プレビューを非表示に
      setTimeout(() => {
        setShowPreview(false);
      }, 500);
    } catch (error) {
      console.error("Error playing video:", error);
      setIsPlaying(false);
    }
  };

  // Processing when video loading is complete
  const handleLoadedData = () => {
    setIsLoaded(true);

    // 動画がロードされたら、アクティブな場合は自動的に再生を開始
    if (isActive && videoRef.current) {
      // 動画が十分にバッファリングされてから再生を開始
      if (videoRef.current.readyState >= 3) {
        // HAVE_FUTURE_DATA以上
        playVideo(videoRef.current);
      }
    }

    if (onLoad) {
      onLoad();
    }
  };

  // プレビュー画像またはカバー画像のURLを取得
  const getPreviewImageUrl = () => {
    return video.previewUrl || video.coverImage;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <div className="relative w-[80%] h-[80%] overflow-hidden rounded-2xl shadow-lg">
        {/* サムネイルプレビュー (動画が読み込まれるまで表示) */}
        {!isPlaying && video.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={video.coverImage}
              alt={video.description || "Video thumbnail"}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={isActive}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQvhAAAAABJRU5ErkJggg=="
              className="rounded-2xl"
            />
          </div>
        )}

        {/* 低解像度のプレビュー画像 (メイン動画が再生されるまで表示) */}
        {showPreview && getPreviewImageUrl() && (
          <div className={`absolute inset-0 z-10`}>
            <Image
              src={getPreviewImageUrl()!}
              alt={video.description || "Video preview"}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={isActive}
              className="rounded-2xl"
            />
          </div>
        )}

        {/* メイン動画 */}
        <video
          ref={videoRef}
          src={`/api/video/${video.id}`}
          className={`w-full h-full object-cover rounded-2xl z-5 ${
            isPlaying ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
          loop
          muted
          playsInline
          preload={isActive ? "auto" : "metadata"}
          onLoadedData={handleLoadedData}
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

        {/* Loading indicator - only show if no preview or cover image is available */}
        {!isLoaded && !isPlaying && !getPreviewImageUrl() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
