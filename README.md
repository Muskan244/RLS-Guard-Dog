# RLS Guard Dog

A minimal Next.js + Supabase demo that showcases secure Row Level Security (RLS):
- Students can only view and add their own progress rows
- Teachers can view and manage all student rows

The app includes a simple UI with a polished landing page and dashboards for both roles.

## Features
- Student dashboard to add/view personal lesson progress
- Teacher dashboard to view, edit, and delete any row
- Email magic-link login and password signup
- Tailwind CSS v4 design with subtle animations
- Vitest integration tests for RLS policies

## Tech Stack
- Next.js 15 (App Router)
- React 19
- Supabase (Auth + Postgres + RLS)
- Tailwind CSS v4
- Vitest for testing

## Project Structure
```
src/app/
  components/Navbar.tsx
  context/UserContext.tsx
  page.tsx (Landing)
  login/page.tsx
  signup/page.tsx
  profile/page.tsx
  dashboard/page.tsx (Student)
  teacher/page.tsx (Teacher)
lib/
  supabaseClient.ts
  useUser.ts
tests/
  rls.policies.test.ts
  helpers/supabaseClients.ts
  setup.ts
```

## Environment Variables
Create a `.env.local` at the project root with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Supabase Setup
1. Create a Supabase project and copy API keys/URL.
2. Create the `progress` table (example schema):
```sql
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  student_email text,
  lesson text not null,
  score int not null,
  created_at timestamptz default now()
);
```
3. Enable RLS and add policies that match the tests:
- Students: can `select` rows where `student_id = auth.uid()`
- Students: can `insert` only with `student_id = auth.uid()`
- Students: cannot update or delete other users' rows
- Teachers: can `select`, `insert`, `update`, `delete` all rows

A common approach is to set `role` user metadata at signup (`student` or `teacher`) and use it in policy checks (e.g. via `auth.jwt()`). The integration tests expect that teachers are able to modify and delete any rows while students are restricted to their own.

## Local Development
Install dependencies and start dev:
```bash
npm install
npm install
npm run dev
```
Open http://localhost:3000

## Testing
Run the integration tests:
```bash
npm run test
```
Vitest configuration avoids loading PostCSS during tests to keep the runner fast and isolated:
- `vitest.config.ts` sets `css: false` and overrides Vite `css.postcss.plugins = []`.
