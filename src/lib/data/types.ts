export interface Video {
  id: string;
  url: string;
  coverImage?: string;
  // 低解像度のプレビュー動画URL（モバイルでの即時再生用）
  previewUrl?: string;
  description?: string;
  userName: string;
  userAvatar?: string;
}
