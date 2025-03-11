import { NextRequest, NextResponse } from "next/server";
import { getVideoById } from "@/lib/data/videos";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const videoId = params.id;
  const video = getVideoById(videoId);

  if (!video || !video.previewUrl) {
    return new NextResponse("Preview video not found", { status: 404 });
  }

  // プレビュー動画のURLをリダイレクト先として設定
  const response = NextResponse.redirect(video.previewUrl);

  // CloudFlare R2のキャッシュ期間を1年間に設定
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}
