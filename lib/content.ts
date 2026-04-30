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

export interface Course {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  thumbnail?: string;
  content: string;
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
  return files.map((filename) => {
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
    };
  });
}
