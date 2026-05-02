import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f8fafc",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #e2e8f0",
            borderRadius: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            height: "100%",
            justifyContent: "center",
            padding: "64px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "18px",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#f97316",
                borderRadius: "999px",
                color: "#ffffff",
                display: "flex",
                height: "68px",
                justifyContent: "center",
                width: "68px",
              }}
            >
              FC
            </div>
            FIRE Calculators
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              maxWidth: "900px",
            }}
          >
            <h1
              style={{
                fontSize: 76,
                letterSpacing: 0,
                lineHeight: 1,
                margin: 0,
              }}
            >
              Know your FIRE number across every variant.
            </h1>
            <p
              style={{
                color: "#475569",
                fontSize: 30,
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              Traditional, Coast, Barista, Lean, and Fat FIRE from one shared
              scenario.
            </p>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
