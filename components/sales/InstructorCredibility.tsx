import type { InstructorInfo } from "@/lib/content";

interface Props {
  instructor: InstructorInfo;
}

export default function InstructorCredibility({ instructor }: Props) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Giảng viên</h2>

        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="flex-shrink-0">
            {instructor.avatar ? (
              <img src={instructor.avatar} alt={instructor.name} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-3xl font-bold">
                LH
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
            <p className="text-orange-600 font-medium mb-3">{instructor.title}</p>
            <p className="text-slate-600 mb-5 leading-relaxed">{instructor.bio}</p>

            {instructor.achievements.length > 0 && (
              <ul className="space-y-2">
                {instructor.achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
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
