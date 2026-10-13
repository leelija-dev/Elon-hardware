import type { SVGProps } from "react";

const paths = {
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  mail: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM22 6l-10 7L2 6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 9v4",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M6 18 18 6M9 6h9v9",
  arrowDown: "M12 4v16M6 14l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  star: "M12 2v20M2 12h20M5 5l14 14M19 5 5 19",
  check: "m5 12 5 5L20 7",
  menu: "M4 7h16M4 12h16M4 17h10",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  fingerprint:
    "M12 11c0 3-1 6-3 8M8 6.5A6 6 0 0 1 18 11c0 1.5-.2 3-.6 4.3M6 9.5A6 6 0 0 0 6 13c0 1.5-.4 3-1.2 4.2M12 11c0 2.6.8 5 2 7",
  keypad: "M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM10 16h4v4h-4z",
  key: "M15 7a4 4 0 1 1-3.5 6L4 20.5 3.5 17l1.5-1.5 1.5 1.5 1.5-1.5-1.5-1.5 4-4A4 4 0 0 1 15 7z",
  mobile: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2",
  wifi: "M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a14 14 0 0 1 20 0M12 19.5h.01",
  flame: "M12 22c4 0 7-3 7-7 0-4-3-6-4-9-2 2-2 4-2 5-1-1-2-2-2-4-3 3-6 5-6 8 0 4 3 7 7 7z",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  building: "M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M16 9h3a1 1 0 0 1 1 1v11M8 8h4M8 12h4M8 16h4M2 21h20",
  bed: "M2 18V8M2 14h20v4M22 18v-5a3 3 0 0 0-3-3h-8v4M6.5 11.5a1.5 1.5 0 1 0 0-.01",
  store: "M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0",
  snow: "M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9",
  bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  layers: "M4 4h16v16H4zM4 12h16",
  pin: "M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z",
  compare: "M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7",
  filter: "M3 5h18M6 12h12M10 19h4",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  user: "M20 21a8 8 0 1 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.2 13.9 7 22l5-3 5 3-1.2-8.1",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-sans text-[30px] font-bold tracking-[-0.01em] ${dark ? "text-white" : "text-ink"}`}>ELON</span>
      <span className={`mt-1.5 pl-px text-[9.5px] font-bold tracking-[0.36em] ${dark ? "text-gold" : "text-gold-text"}`}>
        HARDWARE
      </span>
    </span>
  );
}

/** Gold eight-point star used as decoration in the design. */
export function Star({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 0v40M0 20h40M6 6l28 28M34 6 6 34" />
    </svg>
  );
}
