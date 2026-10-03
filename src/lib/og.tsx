import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { logoMarkSvg } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

/** Shared Open Graph / Twitter card renderer in the brand style (1200×630, ink background). */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "src/assets/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "Geist-SemiBold.ttf")),
  readFile(join(fontDir, "InstrumentSerif-Italic.ttf")),
]);

const INK = "#0f0f0e";
const PAPER = "#f5f4ef";
const MUTED = "#a3a29a";
const ACCENT = "#f2895c";

export async function renderOgImage({
  eyebrow,
  title,
  accent,
  footer = siteConfig.tagline,
}: {
  eyebrow: string;
  /** Bottom-left line; defaults to the tagline. */
  footer?: string;
  /** Main headline in Geist. */
  title: string;
  /** Optional words set in the serif italic accent after the title. */
  accent?: string;
}) {
  const [geist, serif] = await fonts;
  const mark = `data:image/svg+xml;base64,${Buffer.from(logoMarkSvg()).toString("base64")}`;
  const host = new URL(siteConfig.url).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: INK,
          backgroundImage: `radial-gradient(circle at 88% 0%, rgba(194,65,12,0.45), transparent 46%), linear-gradient(${INK}, ${INK})`,
          color: PAPER,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={mark} width={64} height={64} alt="" />
          <span style={{ fontSize: 30, letterSpacing: -0.5 }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: MUTED, letterSpacing: 3, textTransform: "uppercase" }}>
            <div style={{ width: 12, height: 12, background: ACCENT, borderRadius: 2 }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 18, fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5, maxWidth: 1040 }}>
            <span>{title}</span>
            {accent && (
              <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 84, color: ACCENT, letterSpacing: -1 }}>
                {accent}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: MUTED }}>
          <span>{footer}</span>
          <span>{host}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: geist, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
