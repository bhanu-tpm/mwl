import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "About Mithila Web Labs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "About", title: "We build practical technology for", accent: "real businesses" });
}
