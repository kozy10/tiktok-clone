import { Video } from "./types";

export const videos: Video[] = [
  {
    id: "1",
    url: "https://kentarokojima.com/tiktok-clone/video3.mp4",
    previewUrl: "/previews/preview-1.jpg",
    description: "Amazing sunset view #sunset #nature",
    userName: "nature_lover",
    userAvatar: "https://picsum.photos/id/64/200",
  },
  {
    id: "2",
    url: "https://kentarokojima.com/tiktok-clone/video4.mp4",
    previewUrl: "/previews/preview-2.jpg",
    description: "City lights at night #city #lights",
    userName: "urban_explorer",
    userAvatar: "https://picsum.photos/id/65/200",
  },
  {
    id: "3",
    url: "https://kentarokojima.com/tiktok-clone/video5.mp4",
    previewUrl: "/previews/preview-3.jpg",
    description: "Beach waves #beach #ocean #summer",
    userName: "beach_life",
    userAvatar: "https://picsum.photos/id/68/200",
  },
  {
    id: "4",
    url: "https://kentarokojima.com/tiktok-clone/video6.mp4",
    previewUrl: "/previews/preview-4.jpg",
    description: "Mountain hiking adventure #mountains #hiking",
    userName: "adventure_time",
    userAvatar: "https://picsum.photos/id/69/200",
  },
  {
    id: "5",
    url: "https://kentarokojima.com/tiktok-clone/video7.mp4",
    previewUrl: "/previews/preview-5.jpg",
    description: "Cooking a new recipe #food #cooking",
    userName: "food_lover",
    userAvatar: "https://picsum.photos/id/23/200",
  },
  {
    id: "6",
    url: "https://kentarokojima.com/tiktok-clone/video8.mp4",
    previewUrl: "/previews/preview-6.jpg",
    description: "Beautiful mountain lake view #nature #lake #mountains",
    userName: "nature_explorer",
    userAvatar: "https://picsum.photos/id/29/200",
  },
  {
    id: "7",
    url: "https://kentarokojima.com/tiktok-clone/video9.mp4",
    previewUrl: "/previews/preview-7.jpg",
    description: "Peaceful forest stream #forest #stream #nature",
    userName: "wilderness_lover",
    userAvatar: "https://picsum.photos/id/42/200",
  },
  {
    id: "8",
    url: "https://kentarokojima.com/tiktok-clone/video10.mp4",
    previewUrl: "/previews/preview-8.jpg",
    description: "Stunning waterfall in the jungle #waterfall #jungle #travel",
    userName: "adventure_seeker",
    userAvatar: "https://picsum.photos/id/91/200",
  },
];

export function getVideos() {
  return videos;
}

export function getVideoById(id: string) {
  return videos.find((video) => video.id === id);
}
