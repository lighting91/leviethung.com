import type { Course, Testimonial, InstructorInfo } from "@/lib/content";
import SalesHero from "./SalesHero";
import PainPoints from "./PainPoints";
import SolutionIntro from "./SolutionIntro";
import Curriculum from "./Curriculum";
import InstructorCredibility from "./InstructorCredibility";
import Testimonials from "./Testimonials";
import BonusStack from "./BonusStack";
import PriceAnchor from "./PriceAnchor";
import CtaUrgency from "./CtaUrgency";
import Faq from "./Faq";
import RelatedCourses from "./RelatedCourses";

interface Props {
  course: Course;
  testimonials: Testimonial[];
  instructor: InstructorInfo | null;
  relatedCourses: Course[];
}

// Full 8+2 sales landing page — archived for future use.
// To re-enable, import this component in app/(main)/khoa-hoc/[slug]/page.tsx
export default function CourseSalesPage({ course, testimonials, instructor, relatedCourses }: Props) {
  return (
    <div>
      <SalesHero course={course} />
      <PainPoints course={course} />
      <SolutionIntro course={course} />
      <Curriculum course={course} />
      {instructor && <InstructorCredibility instructor={instructor} />}
      <Testimonials testimonials={testimonials} />
      <BonusStack course={course} />
      <PriceAnchor course={course} />
      <CtaUrgency course={course} />
      <Faq course={course} />
      <RelatedCourses courses={relatedCourses} />
    </div>
  );
}
