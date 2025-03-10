import { Video } from "./types";

export const videos: Video[] = [
  {
    id: "1",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video1.mp4",
    description: "Amazing sunset view #sunset #nature",
    userName: "nature_lover",
    userAvatar: "https://picsum.photos/id/64/200",
  },
  {
    id: "2",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video2.mp4",
    description: "City lights at night #city #lights",
    userName: "urban_explorer",
    userAvatar: "https://picsum.photos/id/65/200",
  },
  {
    id: "3",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video3.mp4",
    description: "Beach waves #beach #ocean #summer",
    userName: "beach_life",
    userAvatar: "https://picsum.photos/id/68/200",
  },
  {
    id: "4",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video4.mp4",
    description: "Mountain hiking adventure #mountains #hiking",
    userName: "adventure_time",
    userAvatar: "https://picsum.photos/id/69/200",
  },
  {
    id: "5",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video5.mp4",
    description: "Cooking a new recipe #food #cooking",
    userName: "food_lover",
    userAvatar: "https://picsum.photos/id/23/200",
  },
  {
    id: "6",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video6.mp4",
    description: "Beautiful mountain lake view #nature #lake #mountains",
    userName: "nature_explorer",
    userAvatar: "https://picsum.photos/id/29/200",
  },
  {
    id: "7",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video7.mp4",
    description: "Peaceful forest stream #forest #stream #nature",
    userName: "wilderness_lover",
    userAvatar: "https://picsum.photos/id/42/200",
  },
  {
    id: "8",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video8.mp4",
    description: "Stunning waterfall in the jungle #waterfall #jungle #travel",
    userName: "adventure_seeker",
    userAvatar: "https://picsum.photos/id/91/200",
  },
  {
    id: "9",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video9.mp4",
    description: "Serene mountain landscape #mountains #landscape #peaceful",
    userName: "mountain_climber",
    userAvatar: "https://picsum.photos/id/54/200",
  },
  {
    id: "10",
    url: "https://pub-7c818c43d16441e3a04d0bc54f76151f.r2.dev/video10.mp4",
    description: "Majestic river flowing through canyon #river #canyon #nature",
    userName: "outdoor_enthusiast",
    userAvatar: "https://picsum.photos/id/76/200",
  },
];

export function getVideos() {
  return videos;
}

export function getVideoById(id: string) {
  return videos.find((video) => video.id === id);
}
