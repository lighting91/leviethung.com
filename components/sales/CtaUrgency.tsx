"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

function useCountdown(deadline?: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!deadline) return;
    const target = new Date(deadline).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

export default function CtaUrgency({ course }: Props) {
  const { days, hours, minutes, seconds } = useCountdown(course.deadline);

  return (
    <section className="py-12 px-4 sm:px-6 bg-red-600 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-red-200 font-medium mb-2 text-sm uppercase tracking-wider">Ưu đãi có giới hạn</p>
        <h2 className="text-2xl font-bold mb-4">Đừng để cơ hội trôi qua</h2>

        {course.deadline && (
          <div className="flex justify-center gap-4 mb-6">
            {[
              { label: "Ngày", value: days },
              { label: "Giờ", value: hours },
              { label: "Phút", value: minutes },
              { label: "Giây", value: seconds },
            ].map(({ label, value }) => (
              <div key={label} className="bg-red-700/60 rounded-xl px-4 py-3 min-w-[70px]">
                <div className="text-3xl font-bold tabular-nums">{String(value).padStart(2, "0")}</div>
                <div className="text-red-300 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {course.slots_remaining && course.slots_remaining <= 30 && (
          <p className="text-red-200 text-sm mb-6">
            ⚠️ Chỉ còn <strong className="text-white">{course.slots_remaining} slot</strong> với mức giá này
          </p>
        )}

        <Link
          href="#dang-ky"
          className="inline-block bg-white text-red-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-red-50 transition-colors"
        >
          {course.cta_text ?? "ĐĂNG KÝ NGAY"}
        </Link>
      </div>
    </section>
  );
}
