import { NextRequest, NextResponse } from "next/server";
import { getVideoById } from "@/lib/data/videos";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await params;
  const video = getVideoById(videoId);

  if (!video) {
    return new NextResponse("Video not found", { status: 404 });
  }

  // 動画のURLをリダイレクト先として設定
  const response = NextResponse.redirect(video.url);

  // CloudFlare R2のキャッシュ期間を1年間に設定
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}
