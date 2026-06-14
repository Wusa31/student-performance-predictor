create table if not exists public.student_records (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  matric_no text not null unique,
  attendance numeric not null check (attendance >= 0 and attendance <= 100),
  test1 numeric not null check (test1 >= 0 and test1 <= 100),
  test2 numeric not null check (test2 >= 0 and test2 <= 100),
  test3 numeric not null check (test3 >= 0 and test3 <= 100),
  predicted_exam_score numeric not null,
  risk_level text not null,
  notes text not null,
  created_at timestamptz not null default now()
);