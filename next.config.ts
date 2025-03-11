import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // CloudFlare R2に保存されている動画ファイルのドメインに対するヘッダー設定
        // 注: この設定はVercelでホスティングされるNext.jsアプリケーションからのレスポンスにのみ適用されます
        source: "/api/video/:id*",
        headers: [
          {
            key: "Cache-Control",
            // 1年間のキャッシュ期間を設定 (31536000秒 = 365日)
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // プレビュー動画APIルートに対するキャッシュヘッダー設定
        source: "/api/preview/:id*",
        headers: [
          {
            key: "Cache-Control",
            // 1年間のキャッシュ期間を設定 (31536000秒 = 365日)
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // CloudFlare R2のドメインを信頼できるドメインとして追加
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kentarokojima.com",
        pathname: "/tiktok-clone/**",
      },
    ],
  },
};

export default nextConfig;
