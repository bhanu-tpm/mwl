import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "How we work — Mithila Web Labs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "How we work", title: "Simple process. Working software early.", accent: "No surprises." });
}
