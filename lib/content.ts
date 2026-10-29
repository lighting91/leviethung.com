import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  content: string;
}

export interface Resource {
  slug: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  thumbnail?: string;
  content: string;
}

export interface Lesson {
  slug: string;
  title: string;
  youtube_id?: string;
  duration?: string;
  free_preview?: boolean;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Bonus {
  title: string;
  description?: string;
  value?: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  thumbnail?: string;
  content: string;
  // Extended sales fields
  price?: number;
  original_price?: number;
  hero_headline?: string;
  hero_subheadline?: string;
  pain_points?: string[];
  modules?: Module[];
  bonuses?: Bonus[];
  testimonials_tag?: string;
  related_courses?: string[];
  cta_text?: string;
  deadline?: string;
  faq?: Faq[];
  slots_remaining?: number;
}

export interface Testimonial {
  slug: string;
  name: string;
  avatar?: string;
  role?: string;
  body: string;
  rating?: number;
  result?: string;
  screenshot?: string;
  platform?: string;
  tags: string[];
}

export interface InstructorInfo {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  achievements: string[];
  social: {
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface StatItem {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface CaseStudy {
  name: string;
  platform: string;
  image?: string;
  handle?: string;
  handle_url?: string;
  summary: string;
  metrics: { value: string; label: string }[];
  kols: { name: string; handle?: string; avatar?: string }[];
}

export interface HomeSettings {
  hero: {
    eyebrow: string;
    title: string;
    title_accent: string;
    subtitle: string;
    image?: string;
    float_cards: { value: string; label: string }[];
  };
  stats: {
    intro: string;
    highlight?: StatItem;
    items: StatItem[];
  };
  about: {
    role: string;
    image?: string;
    intro: string;
    checks: string[];
    quote?: string;
  };
  cases: CaseStudy[];
  partners: { name: string; url?: string; logo?: string }[];
}

// Image paths from content files are only used when the file exists in /public,
// so a missing upload falls back to the text/initials layout instead of a broken image.
function publicAsset(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : undefined;
}

function readDir(subdir: string): string[] {
  const dir = path.join(contentDir, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function getAllPosts(): Post[] {
  const files = readDir("posts");
  return files
    .map((filename) => {
      const slug = filename.replace(".md", "");
      const raw = fs.readFileSync(path.join(contentDir, "posts", filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail,
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filepath = path.join(contentDir, "posts", `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    thumbnail: data.thumbnail,
    content,
  };
}

export function getAllResources(): Resource[] {
  const files = readDir("resources");
  return files.map((filename) => {
    const slug = filename.replace(".md", "");
    const raw = fs.readFileSync(path.join(contentDir, "resources", filename), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      fileUrl: data.file_url ?? "",
      thumbnail: data.thumbnail,
      content,
    };
  });
}

export function getAllCourses(): Course[] {
  const files = readDir("courses");
  return files.map((filename) => parseCourseFile(filename));
}

export function getCourseBySlug(slug: string): Course | null {
  const filename = `${slug}.md`;
  const filepath = path.join(contentDir, "courses", filename);
  if (!fs.existsSync(filepath)) return null;
  return parseCourseFile(filename);
}

// YAML 1.1 reads an unquoted "10:00" as the base-60 number 600, so turn it back into mm:ss.
function normalizeDuration(value: unknown): string | undefined {
  if (typeof value === "number") {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  return typeof value === "string" && value ? value : undefined;
}

function parseCourseFile(filename: string): Course {
  const slug = filename.replace(".md", "");
  const raw = fs.readFileSync(path.join(contentDir, "courses", filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    level: data.level ?? "Cơ bản",
    duration: data.duration,
    thumbnail: data.thumbnail,
    content,
    price: data.price,
    original_price: data.original_price,
    hero_headline: data.hero_headline,
    hero_subheadline: data.hero_subheadline,
    pain_points: data.pain_points ?? [],
    modules: (data.modules ?? []).map((m: Module) => ({
      ...m,
      lessons: (m.lessons ?? []).map((l) => ({ ...l, duration: normalizeDuration(l.duration) })),
    })),
    bonuses: data.bonuses ?? [],
    testimonials_tag: data.testimonials_tag,
    related_courses: data.related_courses ?? [],
    cta_text: data.cta_text ?? "ĐĂNG KÝ NGAY",
    deadline: data.deadline,
    faq: data.faq ?? [],
    slots_remaining: data.slots_remaining,
  };
}

export function getAllTestimonials(): Testimonial[] {
  const files = readDir("testimonials");
  return files.map((filename) => {
    const slug = filename.replace(".md", "");
    const raw = fs.readFileSync(path.join(contentDir, "testimonials", filename), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      name: data.name ?? "",
      avatar: publicAsset(data.avatar),
      role: data.role,
      body: data.body ?? "",
      rating: data.rating ?? 5,
      result: data.result,
      screenshot: data.screenshot,
      platform: data.platform,
      tags: data.tags ?? [],
    };
  });
}

export function getTestimonialsByTag(tag: string): Testimonial[] {
  return getAllTestimonials().filter((t) => t.tags.includes(tag));
}

export function getInstructorInfo(): InstructorInfo | null {
  const filepath = path.join(contentDir, "settings", "instructor.md");
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data } = matter(raw);
  return {
    name: data.name ?? "Lê Viết Hưng",
    title: data.title ?? "TikTok Marketing Expert",
    bio: data.bio ?? "",
    avatar: data.avatar,
    achievements: data.achievements ?? [],
    social: data.social ?? {},
  };
}

const platformIcons: Record<string, string> = {
  shopee: "/images/smuft/icon-shopee.webp",
  "tiktok shop": "/images/smuft/icon-tiktokshop.webp",
  tiktokshop: "/images/smuft/icon-tiktokshop.webp",
  tiktok: "/images/smuft/icon-tiktok.webp",
};

export function getPlatformIcon(platform: string): string | undefined {
  return publicAsset(platformIcons[platform.toLowerCase()]);
}

export function getHomeSettings(): HomeSettings {
  const filepath = path.join(contentDir, "settings", "home.md");
  const data = fs.existsSync(filepath) ? matter(fs.readFileSync(filepath, "utf8")).data : {};
  const hero = data.hero ?? {};
  const stats = data.stats ?? {};
  const about = data.about ?? {};
  return {
    hero: {
      eyebrow: hero.eyebrow ?? "",
      title: hero.title ?? "",
      title_accent: hero.title_accent ?? "",
      subtitle: hero.subtitle ?? "",
      image: publicAsset(hero.image),
      float_cards: hero.float_cards ?? [],
    },
    stats: {
      intro: stats.intro ?? "",
      highlight: stats.highlight,
      items: stats.items ?? [],
    },
    about: {
      role: about.role ?? "",
      image: publicAsset(about.image),
      intro: about.intro ?? "",
      checks: about.checks ?? [],
      quote: about.quote,
    },
    cases: (data.cases ?? []).map((c: CaseStudy) => ({
      ...c,
      image: publicAsset(c.image),
      metrics: c.metrics ?? [],
      kols: (c.kols ?? []).map((k) => ({ ...k, avatar: publicAsset(k.avatar) })),
    })),
    partners: (data.partners ?? []).map((p: HomeSettings["partners"][number]) => ({
      ...p,
      logo: publicAsset(p.logo),
    })),
  };
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string): { lesson: Lesson; module: Module } | null {
  const course = getCourseBySlug(courseSlug);
  if (!course?.modules) return null;
  for (const mod of course.modules) {
    const lesson = mod.lessons?.find((l) => l.slug === lessonSlug);
    if (lesson) return { lesson, module: mod };
  }
  return null;
}
