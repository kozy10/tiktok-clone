import { getVideos } from "@/lib/data/videos";
import VideoFeed from "./components/VideoFeed";

export default function Home() {
  const videos = getVideos();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
      <div className="h-screen w-full max-w-[500px] mx-auto relative">
        <VideoFeed videos={videos} />
      </div>
    </main>
  );
}
