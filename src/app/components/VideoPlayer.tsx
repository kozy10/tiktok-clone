"use client";

import { useEffect, useRef, useState } from "react";
import { Video as VideoType } from "@/lib/data/types";
import Image from "next/image";

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  onLoad?: () => void;
  prevVideo?: VideoType;
  nextVideo?: VideoType;
}

export default function VideoPlayer({
  video,
  isActive,
  onLoad,
  prevVideo,
  nextVideo,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(!!video.previewUrl);
  const [isBufferingNext, setIsBufferingNext] = useState(false);
  const [fadeOutPreview, setFadeOutPreview] = useState(false);

  // 動画の読み込みを最適化
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 非アクティブな動画はロード優先度を下げる
    if (!isActive) {
      videoElement.preload = "metadata";
      // 非アクティブになったらプレビュー状態をリセット
      setFadeOutPreview(false);
      setShowPreview(!!video.previewUrl);
    } else {
      videoElement.preload = "auto";

      // モバイルでの自動再生を強制
      videoElement.load();
    }
  }, [isActive, video.previewUrl]);

  // 前後の動画をプリロード
  useEffect(() => {
    // 前の動画をプリロード
    if (prevVideo && prevVideoRef.current) {
      prevVideoRef.current.preload = "auto";
      prevVideoRef.current.load();
    }

    // 次の動画をプリロード
    if (nextVideo && nextVideoRef.current) {
      nextVideoRef.current.preload = "auto";
      nextVideoRef.current.load();
    }
  }, [prevVideo, nextVideo]);

  // 現在の動画が終わりに近づいたら次の動画をバッファリング開始
  useEffect(() => {
    const videoElement = videoRef.current;
    const nextVideoElement = nextVideoRef.current;

    if (!isActive || !videoElement || !nextVideoElement || !nextVideo) return;

    const handleTimeUpdate = () => {
      // 動画の残り時間が3秒未満になったら次の動画のバッファリングを強化
      const remainingTime = videoElement.duration - videoElement.currentTime;
      if (remainingTime < 3 && !isBufferingNext) {
        setIsBufferingNext(true);

        // 次の動画のバッファリングを強化
        nextVideoElement.preload = "auto";

        // 少しだけ再生して止める（バッファリングを促進）
        const bufferNextVideo = async () => {
          try {
            nextVideoElement.currentTime = 0;
            await nextVideoElement.play();
            // 少し再生したら一時停止
            setTimeout(() => {
              nextVideoElement.pause();
              nextVideoElement.currentTime = 0;
            }, 100);
          } catch (error) {
            console.error("Error buffering next video:", error);
          }
        };

        bufferNextVideo();
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isActive, nextVideo, isBufferingNext]);

  // プレビュー動画の管理
  useEffect(() => {
    if (!video.previewUrl || !isActive) return;

    // アクティブになったときにプレビュー画像を表示
    setShowPreview(true);

    return () => {
      // 非アクティブになったときにクリーンアップ
    };
  }, [isActive, video.previewUrl]);

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
      // 非アクティブになったらバッファリング状態をリセット
      setIsBufferingNext(false);
    }
  }, [isActive]);

  // 動画再生を試みる関数
  const playVideo = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play();
      setIsPlaying(true);

      // メイン動画が再生開始したらプレビューをフェードアウト
      setFadeOutPreview(true);

      // フェードアウト完了後にプレビューを非表示に
      setTimeout(() => {
        setShowPreview(false);
      }, 500); // トランジション時間と同じ
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

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <div className="relative w-[80%] h-[80%] overflow-hidden rounded-2xl shadow-lg">
        {/* サムネイルプレビュー (動画が読み込まれるまで表示) */}
        {!isLoaded && !isPlaying && video.coverImage && (
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
        {showPreview && video.previewUrl && (
          <div
            className={`absolute inset-0 z-10 ${
              fadeOutPreview ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
          >
            <Image
              src={video.previewUrl}
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

        {/* 前の動画 (非表示でプリロード) */}
        {prevVideo && (
          <video
            ref={prevVideoRef}
            src={`/api/video/${prevVideo.id}`}
            className="hidden"
            muted
            playsInline
            preload="auto"
          />
        )}

        {/* 次の動画 (非表示でプリロード) */}
        {nextVideo && (
          <video
            ref={nextVideoRef}
            src={`/api/video/${nextVideo.id}`}
            className="hidden"
            muted
            playsInline
            preload="auto"
          />
        )}

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

        {/* Loading indicator */}
        {!isLoaded && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
