import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Contact Mithila Web Labs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Contact", title: "Tell us about your", accent: "business problem" });
}
