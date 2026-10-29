import type { InstructorInfo } from "@/lib/content";

interface Props {
  instructor: InstructorInfo;
}

export default function InstructorCredibility({ instructor }: Props) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-ink text-center mb-8">Giảng viên</h2>

        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="flex-shrink-0">
            {instructor.avatar ? (
              <img src={instructor.avatar} alt={instructor.name} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-2 to-cyan flex items-center justify-center text-white text-3xl font-bold">
                LH
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-ink">{instructor.name}</h3>
            <p className="text-cyan-ink font-medium mb-3">{instructor.title}</p>
            <p className="text-body mb-5 leading-relaxed">{instructor.bio}</p>

            {instructor.achievements.length > 0 && (
              <ul className="space-y-2">
                {instructor.achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-body">
                    <span className="text-cyan-ink font-bold flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
