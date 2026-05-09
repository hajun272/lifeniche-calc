import { ImageResponse } from "next/og";
import { getCalculator } from "@/lib/calculators";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calculator = getCalculator(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F9FC",
          color: "#172033",
          padding: 72,
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 800 }}>
          <div style={{ width: 58, height: 58, borderRadius: 12, background: "#172033" }} />
          생활틈새 계산기
        </div>
        <div>
          <div style={{ color: "#5CBFA7", fontSize: 28, fontWeight: 800 }}>LifeNiche Calc</div>
          <h1 style={{ margin: "22px 0 0", maxWidth: 960, fontSize: 70, lineHeight: 1.08, fontWeight: 900 }}>
            {calculator?.title ?? "한국 생활·금융 계산기"}
          </h1>
          <p style={{ marginTop: 28, maxWidth: 900, fontSize: 30, lineHeight: 1.4, color: "#667085" }}>
            {calculator?.description ?? "검색은 많은데 제대로 된 계산기가 없는 것들만 모았습니다"}
          </p>
        </div>
      </div>
    ),
    size
  );
}
