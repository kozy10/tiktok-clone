import { NextRequest, NextResponse } from "next/server";
import { getVideoById } from "@/lib/data/videos";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const videoId = params.id;
  const video = getVideoById(videoId);

  if (!video || !video.previewUrl) {
    return new NextResponse("Preview image not found", { status: 404 });
  }

  // プレビュー画像のURLを絶対パスに変換
  const previewUrl = new URL(
    video.previewUrl,
    request.nextUrl.origin
  ).toString();

  // プレビュー画像のURLにリダイレクト
  const response = NextResponse.redirect(previewUrl);

  // キャッシュ期間を1年間に設定
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}
