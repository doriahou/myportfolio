import { categories } from "@/data/portfolio";
import Sidebar from "@/components/Sidebar";
import IntroSection from "@/components/IntroSection";
import WorksSection from "@/components/WorksSection";

export default function Home() {
  const navItems = categories.map((c) => ({ id: c.id, label: c.name }));

  return (
    <div className="min-h-screen">
      <Sidebar items={navItems} />

      {/* Main — offset by sidebar width on desktop, top bar on mobile */}
      <main className="pt-14 lg:ml-[220px] lg:pt-0">
        <IntroSection />

        {categories.map((cat) => (
          <WorksSection
            key={cat.id}
            id={cat.id}
            title={cat.name}
            description={cat.description}
            link={cat.link}
            images={cat.images}
          />
        ))}

        <footer className="px-10 py-16 lg:px-16">
          <p className="text-[9px] tracking-[0.3em] text-neutral-300">
            © {new Date().getFullYear()} DORIA HOU
          </p>
        </footer>
      </main>
    </div>
  );
}
