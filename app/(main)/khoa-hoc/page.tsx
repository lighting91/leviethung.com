import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/content";
import LearningPath from "@/components/sales/LearningPath";
import PageHero from "@/components/ui/PageHero";
import CourseCard from "@/components/ui/CourseCard";
import CurriculumPreview from "@/components/ui/CurriculumPreview";
import PlaybookCta from "@/components/ui/PlaybookCta";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Khóa học thực chiến về TikTok Shop, quản lý KOC và livestream bán hàng — có lộ trình, học thử miễn phí.",
};

export default function KhoaHocPage() {
  const courses = getAllCourses();

  return (
    <>
      <PageHero
        kicker="Courses"
        title="Khóa học"
        accent="thực chiến"
        lead="Chương trình học bài bản, đúc kết từ các dự án thật — học tuần tự từng bài, áp dụng ngay vào kênh và gian hàng của bạn."
      />

      <section className="section">
        <div className="container-x">
          {courses.length === 0 ? (
            <div className="card reveal mx-auto max-w-xl p-10 text-center">
              <span className="icon-tile mx-auto mb-5"><Icon name="grad" className="h-6 w-6" /></span>
              <h2 className="mb-2 text-xl font-bold">Đang xây dựng</h2>
              <p className="mx-auto max-w-sm text-[0.95rem]">
                Các khóa học đang được chuẩn bị. Hãy theo dõi trang này để cập nhật sớm nhất!
              </p>
              <Link href="/ve-toi" className="btn btn-outline btn-sm mt-6">Liên hệ để biết thêm</Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {courses.map((course) => <CourseCard key={course.slug} course={course} />)}
              {courses.length === 1 && <CurriculumPreview course={courses[0]} />}
            </div>
          )}

          {courses.length >= 2 && (
            <div className="mt-24">
              <LearningPath courses={courses} />
            </div>
          )}

          <div className="mt-20">
            <PlaybookCta />
          </div>
        </div>
      </section>
    </>
  );
}
