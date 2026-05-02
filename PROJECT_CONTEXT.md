# leviethung.com — Project Context

> File này chứa toàn bộ thông tin cần thiết để Claude có thể hiểu và tiếp tục dự án trong một session mới.

---

## 1. Tổng quan dự án

**Website:** leviethung.com — trang cá nhân của Lê Viết Hưng (TikTok Marketing)  
**Owner:** Lê Viết Hưng — người dùng không biết code (no-code), dùng CMS để quản lý nội dung  
**Stack:** Next.js 16.2.4 (App Router) · Tailwind CSS v4 · Supabase · Sveltia CMS · Vercel  
**Repo:** https://github.com/lighting91/leviethung.com (public)  
**Live:** https://leviethung.com  
**Local path:** `D:\Claude\leviethung.com`

---

## 2. Tech Stack chi tiết

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Framework | Next.js 16.2.4 | App Router, **KHÔNG phải Next.js 13/14** |
| Styling | Tailwind CSS v4 | `@theme inline` trong globals.css |
| Auth + DB | Supabase | `@supabase/ssr` (createBrowserClient / createServerClient) |
| CMS | Sveltia CMS | `/admin` — commit trực tiếp lên GitHub |
| Deploy | Vercel | Auto-deploy qua GitHub Actions |
| Content | Markdown + gray-matter | Files trong `content/` |
| Middleware | `proxy.ts` (KHÔNG phải middleware.ts) | Next.js 16 breaking change |

---

## 3. Credentials & IDs quan trọng

> ⚠️ KHÔNG lưu token/secret vào file này. Xem tại Vercel Dashboard → Settings → Environment Variables

```
# Supabase (NEXT_PUBLIC_ = public by design, an toàn)
NEXT_PUBLIC_SUPABASE_URL=https://xkhygsgwvsauaqwiuysk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=             ← xem Vercel env

# Vercel (chỉ dùng trong GitHub Actions secret — KHÔNG để ở đây)
VERCEL_ORG_ID=team_glPbBvGRIgxAERuzKDNIM2Bs
VERCEL_PROJECT_ID=prj_qUintqGwhedTKEWlXSrlc2MTobLM
VERCEL_TOKEN=                              ← GitHub Secret (Settings → Secrets)

# GitHub OAuth (Sveltia CMS)
GITHUB_CLIENT_ID=Ov23liYZD7l33BUZs8Np     ← public (trong config.yml), an toàn
GITHUB_CLIENT_SECRET=                      ← chỉ trong Vercel env

# Thanh toán (CHƯA setup — cần thêm vào Vercel Dashboard)
BANK_ACCOUNT_NO=
BANK_ACCOUNT_NAME=              # Không dấu, viết hoa (VD: LE VIET HUNG)
BANK_ACQ_ID=                    # MB=970422, VCB=970436, TCB=970407
BANK_NAME=                      # Tên hiển thị (VD: MB Bank)
SEPAY_SECRET=                   # Webhook secret từ SePay dashboard
GOOGLE_SHEET_WEBHOOK_URL=       # Google Apps Script URL (tùy chọn)
```

---

## 4. Cấu trúc thư mục

```
leviethung.com/
├── app/
│   ├── layout.tsx                          # Root layout (HTML shell, Inter font)
│   ├── globals.css                         # Tailwind + màu: --color-primary: #FF6B35
│   ├── (main)/                             # Route group CÓ Header + Footer
│   │   ├── layout.tsx                      # Header + Footer wrapper
│   │   ├── page.tsx                        # Trang chủ
│   │   ├── blog/[slug]/page.tsx
│   │   ├── khoa-hoc/
│   │   │   ├── page.tsx                    # Danh sách khóa học
│   │   │   └── [slug]/
│   │   │       ├── page.tsx               # Chi tiết khóa học (CÓ nút mua + xem thử)
│   │   │       └── thanh-toan/page.tsx    # Trang thanh toán (VietQR + SePay)
│   │   ├── tai-khoan/
│   │   │   ├── page.tsx                   # Dashboard học viên
│   │   │   └── cap-nhat/page.tsx          # Đổi mật khẩu, cập nhật SĐT, tên
│   │   ├── dang-nhap/page.tsx
│   │   └── dang-ky/page.tsx
│   ├── khoa-hoc/[slug]/hoc/               # Route group KHÔNG có Header/Footer
│   │   ├── layout.tsx                     # Empty layout (loại bỏ Header/Footer)
│   │   └── [lesson]/page.tsx              # Trang xem bài học
│   └── api/
│       ├── auth/callback/route.ts         # Supabase email verify callback
│       ├── auth/signout/route.ts          # Đăng xuất
│       ├── oauth/route.ts                 # GitHub OAuth cho CMS
│       ├── oauth/callback/route.ts
│       ├── orders/route.ts                # POST: tạo/lấy đơn hàng + QR VietQR
│       ├── progress/route.ts              # POST: đánh dấu bài học hoàn thành
│       └── webhook/sepay/route.ts         # SePay payment webhook → tạo enrollment
├── components/
│   ├── Header.tsx                         # Sticky header + user dropdown (tên + menu)
│   ├── Footer.tsx
│   ├── LessonViewer.tsx                   # Video player + sidebar + sequential lock
│   └── sales/                             # 8+2 sales page components (archived)
│       ├── CourseSalesPage.tsx            # Wrapper tổng hợp 10 sections (dùng sau)
│       ├── SalesHero.tsx, PainPoints.tsx, SolutionIntro.tsx, Curriculum.tsx
│       ├── InstructorCredibility.tsx, Testimonials.tsx, BonusStack.tsx
│       ├── PriceAnchor.tsx, CtaUrgency.tsx, Faq.tsx
│       ├── RelatedCourses.tsx, LearningPath.tsx
├── lib/
│   ├── content.ts                         # Đọc markdown files, parse frontmatter
│   └── supabase/
│       ├── client.ts                      # createBrowserClient (dùng trong "use client")
│       └── server.ts                      # createServerClient (dùng trong server component)
├── proxy.ts                               # Route protection (Next.js 16: proxy, KHÔNG middleware)
├── content/
│   ├── courses/tiktok-marketing-tu-zero.md
│   ├── posts/
│   ├── resources/
│   ├── settings/instructor.md
│   └── testimonials/
└── public/admin/
    ├── index.html                         # Sveltia CMS
    └── config.yml                         # CMS collections config
```

---

## 5. Supabase Database Schema

### Tables đã tạo (thủ công qua Supabase Dashboard)

```sql
-- 1. profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  phone text,         -- thêm sau: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
  created_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false
);

-- 2. enrollments (khóa học đã đăng ký / mua)
CREATE TABLE enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  course_slug text NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
  -- UNIQUE(user_id, course_slug) nếu dùng upsert
);

-- 3. lesson_progress (tiến độ học — học tuần tự)
CREATE TABLE lesson_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  course_slug text NOT NULL,
  lesson_slug text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_slug, lesson_slug)
);

-- 4. orders (đơn hàng thanh toán)
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  user_email text,
  user_name text,
  course_slug text NOT NULL,
  amount integer NOT NULL,
  transfer_content text UNIQUE NOT NULL,  -- VD: LVHTIKTOKMA1K8X7P2
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);
```

### SQL cần chạy nếu chưa có (Supabase Dashboard → SQL Editor)

```sql
-- Thêm cột phone
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- RLS cho orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Update orders" ON orders FOR UPDATE USING (true);

-- RLS cho lesson_progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON lesson_progress
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS cho enrollments (nếu chưa có)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Update enrollments" ON enrollments FOR UPDATE USING (true);
```

### Supabase Auth settings
- Site URL: `https://leviethung.com`
- Redirect URL: `https://leviethung.com/api/auth/callback`

---

## 6. Deploy Pipeline

```
Developer/CMS → commit to GitHub (lighting91/leviethung.com) → GitHub Actions → Vercel deploy
```

File `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: team_glPbBvGRIgxAERuzKDNIM2Bs
          VERCEL_PROJECT_ID: prj_qUintqGwhedTKEWlXSrlc2MTobLM
```

GitHub Secret cần: `VERCEL_TOKEN` (đã cài)

---

## 7. Các tính năng đã hoàn thành

### Phase 1 — Rebrand ✅
- Màu từ indigo/violet → cam-đỏ `#FF6B35` (orange-600)
- CSS variable: `--color-primary: #FF6B35`

### Phase 2 — Khóa học + CMS ✅
- Trang chi tiết `/khoa-hoc/[slug]` — hero + curriculum + bonus + giảng viên + FAQ + sidebar giá
- Nút "Đăng ký ngay" → `/thanh-toan`, nút "Học thử miễn phí" → bài free_preview đầu tiên
- Bài `free_preview: true` trong curriculum list là link click được
- Sales page 8+2 đầy đủ đã lưu vào `components/sales/CourseSalesPage.tsx` — dùng lại sau
- CMS collections: posts, resources, courses (modules/lessons/bonuses/faq), testimonials, settings

### Phase 3 — Auth + Thành viên ✅
- Đăng ký (`/dang-ky`) + Đăng nhập (`/dang-nhap`)
- Dashboard (`/tai-khoan`) — danh sách khóa học, số bài đã hoàn thành
- Cập nhật tài khoản (`/tai-khoan/cap-nhat`) — đổi tên, SĐT, mật khẩu
- Header: hiển thị tên người dùng, dropdown có "Khóa học của tôi" + "Cài đặt tài khoản"
- `proxy.ts` bảo vệ route `/tai-khoan/*` → redirect về `/dang-nhap`

### Phase 4 — Lesson Viewer ✅
- Route `/khoa-hoc/[slug]/hoc/[lesson]` — không có Header/Footer (empty layout)
- Video YouTube embed (youtube-nocookie.com, modestbranding)
- Sidebar: tên user + logout, progress bar, module accordion
- **Học tuần tự**: bài N locked cho đến khi hoàn thành bài N-1
- **Đánh dấu hoàn thành**: button → POST `/api/progress` → mở khóa bài tiếp theo
- Lock icons: ✅ hoàn thành / ▶ đang xem / 🔒 chưa mở
- Gợi ý khóa học liên quan ở cuối trang
- Bảo vệ video: block chuột phải, chặn Ctrl+S/U/P, F12

### Phase 5 — Thanh toán ✅ (một phần)
- Trang `/khoa-hoc/[slug]/thanh-toan` — hiển thị QR + thông tin CK
- `POST /api/orders` — tạo đơn hàng với mã chuyển khoản duy nhất (format: `LVH{SLUG}{TIME}`)
- VietQR integration — auto generate QR nếu có env vars ngân hàng
- `POST /api/webhook/sepay` — nhận webhook → cập nhật order → tạo enrollment → log Google Sheet
- **Chưa hoàn thành**: Chưa điền env vars ngân hàng (BANK_ACCOUNT_NO, BANK_ACQ_ID, ...)

---

## 8. Tính năng còn lại / TODO

### Cần làm ngay
- [ ] Thêm env vars ngân hàng vào Vercel (BANK_ACCOUNT_NO, BANK_ACQ_ID, BANK_ACCOUNT_NAME, BANK_NAME)
- [ ] Cấu hình SePay webhook URL = `https://leviethung.com/api/webhook/sepay`
- [ ] Test luồng thanh toán đầu đủ
- [ ] Chạy SQL thêm cột `phone` + tạo table `orders` + `lesson_progress` nếu chưa có

### Phase 5 còn lại
- [ ] Google Apps Script cho Google Sheet logging (user tự tạo, lấy URL → Vercel env GOOGLE_SHEET_WEBHOOK_URL)
- [ ] Countdown timer trên trang khóa học (thêm vào CtaUrgency component)
- [ ] SEO metadata đầy đủ cho tất cả trang
- [ ] Loading skeleton states
- [ ] Trang thanh toán thành công / polling status

### Tương lai
- [ ] Kích hoạt lại full sales page 8+2 (import CourseSalesPage từ `components/sales/`)
- [ ] Chứng chỉ hoàn thành khóa học (PDF generation)
- [ ] Affiliate / referral system

---

## 9. Content Types (lib/content.ts)

```typescript
interface Lesson {
  slug: string;
  title: string;
  youtube_id?: string;   // full URL hoặc plain ID đều được — extractYouTubeId() tự parse
  duration?: string;     // "15:30"
  free_preview?: boolean;
}

interface Module { title: string; lessons: Lesson[]; }

interface Course {
  slug: string; title: string; description: string; level: string;
  price?: number; original_price?: number;
  hero_headline?: string; hero_subheadline?: string;
  pain_points?: string[]; modules?: Module[]; bonuses?: Bonus[];
  testimonials_tag?: string; related_courses?: string[];
  cta_text?: string; deadline?: string; faq?: Faq[];
  slots_remaining?: number;
}
```

---

## 10. Breaking Changes Next.js 16 (quan trọng!)

1. **`middleware.ts` → `proxy.ts`**: export `proxy` function (KHÔNG phải `middleware`)
2. **`params` là Promise**: phải `await params` trong page components
3. **`cookies()` là async**: phải `await cookies()` trong server components
4. **`useSearchParams()` cần Suspense boundary** trong client pages
5. **Tailwind v4**: dùng `@theme inline { --color-* }` thay vì `tailwind.config.js`

---

## 11. Luồng thanh toán (khi có env vars)

```
User → /khoa-hoc/[slug] → click "Đăng ký" 
  → /khoa-hoc/[slug]/thanh-toan (client component)
  → nếu chưa login: redirect /dang-nhap?redirect=...
  → POST /api/orders → tạo order trong Supabase, lấy transfer_content
  → fetch VietQR API → hiển thị QR code
  → User chuyển khoản với nội dung: "LVHTIKTOKMA1K8X7P2"
  → SePay webhook → POST /api/webhook/sepay
  → parse transfer_content → tìm order → update paid → tạo enrollment
  → (tùy chọn) log sang Google Sheet
  → User vào /tai-khoan thấy khóa học đã có
```

Admin có thể **cấp quyền thủ công** bất kỳ lúc nào qua:
**Supabase Dashboard → Table Editor → enrollments → Insert row**

---

## 12. CMS (Sveltia) — cách dùng

URL: `https://leviethung.com/admin`  
Login: GitHub OAuth (account lighting91)

Thêm YouTube video cho bài học:
1. Vào **Khóa học** → chọn khóa → **Modules & Bài học** → chọn bài
2. Dán URL YouTube đầy đủ vào field "YouTube Video ID" (VD: `https://youtu.be/9XjFZQpe1gU?si=xxx`)
3. **Save → Publish** → GitHub Actions tự deploy (~1 phút)

---

## 13. Màu sắc & Design System

```css
/* Primary */
--color-primary: #FF6B35       /* orange-600 */
--color-primary-dark: #E55A2B  /* orange-700 */
--color-primary-light: #FFF1EC /* orange-50 */

/* Dùng trong code */
bg-orange-600, text-orange-600, border-orange-600
hover:bg-orange-700
bg-slate-900 (dark sections)
bg-slate-50 (light bg sections)
```

---

## 14. Lỗi đã gặp & cách fix

| Lỗi | Nguyên nhân | Fix |
|-----|-------------|-----|
| YouTube Error 153 | `sandbox` attribute trên iframe quá chặt | Xóa `sandbox` attribute |
| BOM encoding bug | PowerShell `Out-File` thêm BOM vào env var | Dùng `[System.IO.File]::WriteAllText` với ASCII encoding |
| `useSearchParams()` lỗi | Cần Suspense boundary | Wrap trong `<Suspense>` |
| `[slug]` wildcard PowerShell | `[]` bị treat là regex | Dùng `-LiteralPath` flag |
| Supabase prerender error | `createClient()` ở component level chạy trong SSR | Chuyển vào `useEffect` |
| git push rejected | Remote có changes mới | `git pull --rebase` trước khi push |
