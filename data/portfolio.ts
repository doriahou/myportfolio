import projects from "@/src/config/projects";

export type Category = {
  id: string;
  name: string;
  description?: string;
  link?: string;
  cover: string;
  images: string[];
};

// Derived from src/config/projects.ts — edit that file, not this one.
export const categories: Category[] = projects.map((p) => ({
  id: p.id,
  name: p.category,
  description: p.description,
  link: p.link,
  cover: p.images[0] ?? "",
  images: p.images,
}));

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
