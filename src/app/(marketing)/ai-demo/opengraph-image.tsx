import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "AI demo — Mithila Web Labs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "AI demo", title: "Describe a process.", accent: "See how we'd fix it." });
}
