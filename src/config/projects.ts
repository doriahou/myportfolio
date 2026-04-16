// src/config/projects.ts
// Images are auto-managed — run `npm run sync` after adding/removing files.
// description, link, and category fields are hand-edited and preserved by sync.

export type ProjectCategory = {
  id: string;
  category: string;
  description?: string;
  link?: string;
  images: string[];
};

const projects: ProjectCategory[] = [
  {
    id: "branding",
    category: "BRANDING",
    description: "Voya pets VI  |  Adobe Illustrator, Lovart AI",
    images: [
      "/images/branding/VI-01.png",
      "/images/branding/VI-02.png",
      "/images/branding/VI-03.png",
    ],
  },
  {
    id: "ui-ux",
    category: "UI/UX",
    description: "Rooted app 🔗  |  Figma, Claude Code",
    link: "https://doriahou.github.io/rooted-app-doria/home.html",
    images: [
      "/images/ui-ux/calender.png",
      "/images/ui-ux/details.png",
      "/images/ui-ux/explore.png",
      "/images/ui-ux/homepage.png",
      "/images/ui-ux/onboarding.png",
      "/images/ui-ux/onboarding2.png",
      "/images/ui-ux/signin.png",
    ],
  },
  {
    id: "graphic-design",
    category: "GRAPHIC DESIGN",
    description: "Poster, Album, Calendar  |  Adobe Illustrator, Photoshop, Lovart AI",
    images: [
      "/images/graphic-design/calendar.png",
      "/images/graphic-design/graphic.png",
    ],
  },
  {
    id: "product-design",
    category: "PRODUCT DESIGN",
    description: "Gynecological Tools  |  Rhino, Blender, Photoshop, Figma",
    images: [
      "/images/product-design/ScreenShot_2026-04-15_163541_674.png",
      "/images/product-design/截屏2026-04-15 16.34.35.png",
      "/images/product-design/截屏2026-04-15 16.35.10.png",
    ],
  },
  {
    id: "digital-media",
    category: "DIGITAL MEDIA",
    description: "Installation Arts  |  Blender, UE, Photoshop, Arduino",
    images: [
      "/images/digital-media/Breathe 1.JPG",
      "/images/digital-media/ScreenShot_2026-04-15_164126_766.png",
    ],
  },
  {
    id: "documentary",
    category: "DOCUMENTARY",
    images: [
      "/images/documentary/ScreenShot_2026-04-15_162743_875.png",
      "/images/documentary/ScreenShot_2026-04-15_162756_495.png",
    ],
  },
  {
    id: "portrait-photography",
    category: "PORTRAIT PHOTOGRAPHY",
    images: [
      "/images/portrait-photography/IMG_3414.JPG",
      "/images/portrait-photography/IMG_3417.JPG",
      "/images/portrait-photography/IMG_3902.JPG",
      "/images/portrait-photography/IMG_3904.jpg",
      "/images/portrait-photography/IMG_3906.jpg",
      "/images/portrait-photography/IMG_3908.jpg",
      "/images/portrait-photography/IMG_4447.jpg",
      "/images/portrait-photography/IMG_4448.jpg",
    ],
  }
];

export default projects;
