"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/data/portfolio";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/${category.id}`}
      className="group relative block overflow-hidden bg-neutral-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.cover}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" />
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <span className="text-sm font-light tracking-[0.2em] uppercase text-white/90">
            {category.name}
          </span>
          <span className="text-xs text-white/50">
            {category.images.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
