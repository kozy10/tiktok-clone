import { Video } from "./types";

export const videos: Video[] = [
  {
    id: "0",
    url: "https://kentarokojima.com/tiktok-clone/video22.mp4",
    previewUrl: "/previews/preview-9.jpg",
    description: "Stunning waterfall in the jungle #waterfall #jungle #travel",
    userName: "adventure_seeker",
    userAvatar: "https://picsum.photos/id/91/200",
  },
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
    id: "10",
    url: "https://kentarokojima.com/tiktok-clone/video23.mp4",
    previewUrl: "/previews/preview-10.jpg",
    description: "Stunning waterfall in the jungle #waterfall #jungle #travel",
    userName: "adventure_seeker",
    userAvatar: "https://picsum.photos/id/91/200",
  },
  {
    id: "11",
    url: "https://kentarokojima.com/tiktok-clone/video24.mp4",
    previewUrl: "/previews/preview-11.jpg",
    description: "Stunning waterfall in the jungle #waterfall #jungle #travel",
    userName: "adventure_seeker",
    userAvatar: "https://picsum.photos/id/91/200",
  },
  {
    id: "12",
    url: "https://kentarokojima.com/tiktok-clone/video25.mp4",
    previewUrl: "/previews/preview-12.jpg",
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
