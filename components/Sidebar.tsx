"use client";

import { useEffect, useState } from "react";

type NavItem = { id: string; label: string };

export default function Sidebar({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[220px] flex-col border-r border-neutral-200/70 bg-white/60 backdrop-blur-md lg:flex">
        <div className="px-8 pb-10 pt-12">
          <span className="text-[11px] font-semibold tracking-[0.4em] text-neutral-800">
            PEBBLE
          </span>
        </div>

        <nav className="flex flex-col px-8 gap-0.5">
          {items.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`group relative py-2.5 text-left text-[10.5px] tracking-[0.18em] transition-all duration-200 ${
                active === id
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <span
                className={`absolute left-[-16px] top-1/2 h-[1px] -translate-y-1/2 bg-neutral-700 transition-all duration-300 ${
                  active === id ? "w-2.5 opacity-100" : "w-0 opacity-0"
                }`}
              />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-8 pb-10">
          <p className="text-[9px] tracking-[0.2em] text-neutral-300">
            DORIA HOU
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-neutral-200/60 bg-white/70 px-6 py-4 backdrop-blur-sm lg:hidden">
        <span className="text-[11px] font-semibold tracking-[0.4em] text-neutral-800">
          PEBBLE
        </span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-neutral-500"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-10 bg-white/95 pt-16 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col px-8 pt-6 gap-1">
            {items.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="py-3 text-left text-[11px] tracking-[0.2em] text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
