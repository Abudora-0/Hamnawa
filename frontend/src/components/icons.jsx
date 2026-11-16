function Icon({ children, label }) {
  return (
    <svg
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      className="nav-icon"
      focusable="false"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      {children}
    </svg>
  );
}

export function HomeIcon() {
  return <Icon><path d="m3 11 9-8 9 8v9H5v-7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>;
}

export function UploadIcon() {
  return <Icon><path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Icon>;
}

export function ReaderIcon() {
  return <Icon><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>;
}

export function SpeakIcon() {
  return <Icon><path d="M4 10v4h4l5 4V6l-5 4H4Zm12 0a4 4 0 0 1 0 4m2-6a7 7 0 0 1 0 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Icon>;
}

export function SettingsIcon() {
  return <Icon><path d="m12 3 1 2.2 2.3.7 2.1-1 1.7 1.7-1 2.1.7 2.3 2.2 1v2.4l-2.2 1-.7 2.3 1 2.1-1.7 1.7-2.1-1-2.3.7-1 2.2H9.6l-1-2.2-2.3-.7-2.1 1-1.7-1.7 1-2.1-.7-2.3-2.2-1v-2.4l2.2-1 .7-2.3-1-2.1 1.7-1.7 2.1 1 2.3-.7 1-2.2H12Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="10.8" cy="12.5" r="3" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>;
}

export function HelpIcon() {
  return <Icon><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1.1.9-1.7 1.3-1.7 2.7M12 17v.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></Icon>;
}

export function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return <Icon><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" fill="none" stroke="currentColor" strokeWidth="2" /></Icon>;
  }
  if (theme === "contrast") {
    return <Icon><circle cx="12" cy="12" r="9" fill="currentColor" /><path d="M12 3a9 9 0 0 1 0 18V3Z" fill="var(--surface)" /></Icon>;
  }
  return <Icon><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></Icon>;
}

export function MenuIcon({ open }) {
  return <Icon><path d={open ? "M5 5l14 14M19 5 5 19" : "M4 7h16M4 12h16M4 17h16"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></Icon>;
}

export function WaveMark() {
  return <svg aria-hidden="true" className="logo-mark" viewBox="0 0 40 40" focusable="false"><rect x="2" y="2" width="36" height="36" rx="9" fill="var(--accent)" /><path d="M7 21c4-8 7 8 11 0s7-8 11 0 5 5 6 1" fill="none" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" /></svg>;
}
