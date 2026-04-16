import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryById, categories } from "@/data/portfolio";
import MasonryGrid from "@/components/MasonryGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: id } = await params;
  const category = getCategoryById(id);
  return { title: category ? `${category.name} — Portfolio` : "Portfolio" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: id } = await params;
  const category = getCategoryById(id);
  if (!category) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-neutral-200/60 bg-white/70 px-4 py-4 backdrop-blur-sm sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-neutral-800"
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </Link>
        <h1 className="text-[10px] font-medium tracking-[0.3em] text-neutral-600">
          {category.name}
        </h1>
        <span className="ml-auto text-[9px] tracking-widest text-neutral-300 tabular-nums">
          {category.images.length}
        </span>
      </header>

      <section className="p-2 sm:p-3">
        <MasonryGrid images={category.images} />
      </section>
    </main>
  );
}
