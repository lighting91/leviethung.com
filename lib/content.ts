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
    modules: data.modules ?? [],
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
      avatar: data.avatar,
      role: data.role,
      body: data.body ?? "",
      rating: data.rating ?? 5,
      result: data.result,
      screenshot: data.screenshot,
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

export function getLessonBySlug(courseSlug: string, lessonSlug: string): { lesson: Lesson; module: Module } | null {
  const course = getCourseBySlug(courseSlug);
  if (!course?.modules) return null;
  for (const mod of course.modules) {
    const lesson = mod.lessons?.find((l) => l.slug === lessonSlug);
    if (lesson) return { lesson, module: mod };
  }
  return null;
}
