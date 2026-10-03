import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Mithila Web Labs — AI-Powered Business Applications";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Product engineering · AI · Automation", title: "AI-Powered Business Applications", accent: "& Digital Products", footer: "Automation · Business apps · AI knowledge · Customer portals" });
}
