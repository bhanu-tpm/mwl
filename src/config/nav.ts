export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "AI Demo", href: "/ai-demo" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "About", href: "/about" },
];

export const primaryCta: NavItem = {
  label: "Discuss Your Problem",
  href: "/contact",
};

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Solutions", href: "/solutions" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "AI Demo", href: "/ai-demo" },
    ],
  },
  {
    title: "Legal",
    items: [{ label: "Privacy Policy", href: "/privacy" }],
  },
];
