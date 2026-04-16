import Image from "next/image";

type Props = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  images: string[];
};

export default function WorksSection({ id, title, description, link, images }: Props) {
  return (
    <section id={id} className="flex min-h-screen flex-col justify-center py-10">

      {/* Section header */}
      <div className="mb-7 px-10 lg:px-16">
        {/* Title — slightly larger & bolder than before */}
        <div className="flex items-baseline gap-4">
          <h2 className="text-[13px] font-semibold tracking-[0.3em] text-neutral-700">
            {title}
          </h2>
          <span className="text-[9px] tracking-widest text-neutral-300">
            {images.length}
          </span>
        </div>

        {/* Description — project name | tools, optionally linked */}
        {description && (
          link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[11px] tracking-[0.08em] text-neutral-400 font-light transition-colors hover:text-neutral-600"
            >
              {description}
            </a>
          ) : (
            <p className="mt-2 text-[11px] tracking-[0.08em] text-neutral-400 font-light">
              {description}
            </p>
          )
        )}
      </div>

      {/*
        Horizontal scroll rail.
        width={0}/height={0} + CSS h-full w-auto = natural aspect ratio at 70vh,
        no squishing, no fixed-width box forcing.
      */}
      <div className="no-scrollbar flex h-[70vh] snap-x snap-mandatory gap-4 overflow-x-auto pl-10 lg:pl-16">
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start rounded-xl overflow-hidden bg-neutral-100"
          >
            <Image
              src={src}
              alt=""
              width={0}
              height={0}
              sizes="(max-width: 640px) 80vw, 60vh"
              className="h-full w-auto object-contain"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="w-10 flex-shrink-0 lg:w-16" aria-hidden />
      </div>

    </section>
  );
}
