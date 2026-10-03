import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Solutions — Mithila Web Labs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Solutions", title: "Practical software for", accent: "real business problems" });
}
