import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCourses,
  getCourseBySlug,
  getTestimonialsByTag,
  getInstructorInfo,
} from "@/lib/content";
import SalesHero from "@/components/sales/SalesHero";
import PainPoints from "@/components/sales/PainPoints";
import SolutionIntro from "@/components/sales/SolutionIntro";
import Curriculum from "@/components/sales/Curriculum";
import InstructorCredibility from "@/components/sales/InstructorCredibility";
import Testimonials from "@/components/sales/Testimonials";
import BonusStack from "@/components/sales/BonusStack";
import PriceAnchor from "@/components/sales/PriceAnchor";
import CtaUrgency from "@/components/sales/CtaUrgency";
import Faq from "@/components/sales/Faq";
import RelatedCourses from "@/components/sales/RelatedCourses";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const testimonials = course.testimonials_tag
    ? getTestimonialsByTag(course.testimonials_tag)
    : [];

  const instructor = getInstructorInfo();

  const allCourses = getAllCourses();
  const relatedCourses = course.related_courses?.length
    ? allCourses.filter((c) => course.related_courses!.includes(c.slug))
    : allCourses.filter((c) => c.slug !== slug).slice(0, 2);

  return (
    <div>
      {/* 1. Hero */}
      <SalesHero course={course} />

      {/* 2. Pain Points */}
      <PainPoints course={course} />

      {/* 3. Solution Intro */}
      <SolutionIntro course={course} />

      {/* 4. Curriculum */}
      <Curriculum course={course} />

      {/* 5. Instructor Credibility */}
      {instructor && <InstructorCredibility instructor={instructor} />}

      {/* 6. Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* 7. Bonus Stack */}
      <BonusStack course={course} />

      {/* 8. Price Anchor + CTA */}
      <PriceAnchor course={course} />

      {/* 9. Urgency CTA */}
      <CtaUrgency course={course} />

      {/* 10. FAQ */}
      <Faq course={course} />

      {/* Cross-sell: Related Courses */}
      <RelatedCourses courses={relatedCourses} />
    </div>
  );
}
