"use client";

import Image from "next/image";

export default function IntroSection() {
  const scrollToFirst = () => {
    document.getElementById("branding")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex min-h-screen items-center py-24 pl-12 pr-10 lg:pl-28 xl:pl-36">
      <div className="grid w-full max-w-4xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_auto]">

        {/* ── Text ── */}
        <div>
          {/* Name — elegant sans-serif */}
          <h1 className="mb-5 font-sans text-5xl font-light leading-tight tracking-tight text-neutral-900 sm:text-6xl">
            Hi, I&apos;m Yutong
            <br />
            (Doria) Hou.
          </h1>

          {/* Role */}
          <p className="mb-9 text-[11px] tracking-[0.35em] text-neutral-500 uppercase">
            Digital Media Designer
          </p>

          {/* Education */}
          <div className="mb-9 space-y-3.5 border-l border-neutral-300 pl-4">
            <div>
              <p className="text-[13px] font-medium text-neutral-700 leading-relaxed">
                University of Southern California
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                MS Integrated Design, Business, and Technology
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-neutral-700 leading-relaxed">
                University of Washington
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cinema and Media Studies &amp; Digital Arts
              </p>
            </div>
          </div>

          {/* Bio — same dark tone as education text */}
          <p className="mb-11 max-w-xs text-[15px] leading-relaxed text-neutral-700">
            Visual Designer &amp; Portrait Photographer,
            <br />
            currently working in Product Management.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-7">
            <button
              onClick={scrollToFirst}
              className="group flex items-center gap-2 text-[11px] tracking-[0.15em] text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              <span>works</span>
            </button>

            <a
              href="mailto:doria@example.com"
              className="rounded-full border border-neutral-300 px-5 py-2 text-[11px] tracking-[0.15em] text-neutral-600 transition-all hover:border-neutral-600 hover:text-neutral-900"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* ── Photo ── */}
        <div className="mx-auto w-[250px] lg:w-[280px]">
          <div className="relative">
            {/* Decorative offset frame */}
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-neutral-300/60" />
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src="/me.jpg"
                alt="Doria Hou"
                fill
                sizes="280px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
