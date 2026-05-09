import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "생활틈새 계산기",
    short_name: "LifeNiche Calc",
    description: "검색은 많은데 제대로 된 계산기가 없는 한국 생활·금융 계산기 모음",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FC",
    theme_color: "#172033",
    lang: "ko-KR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
