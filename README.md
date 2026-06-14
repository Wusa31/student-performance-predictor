# Student Performance Predictor

A Next.js app that predicts a student's likely exam score from:
- attendance
- test scores

It includes:
- public dashboard for viewing records
- admin-only upload form
- prediction engine
- Supabase-backed storage

## What this app does

The system calculates:
- predicted exam score
- risk level based on attendance/test patterns
- simple notes for review

It is designed to help flag unusual performance patterns for academic integrity review.

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Postgres

## 1) Create the database table

Run this SQL in your Supabase SQL editor:

```sql
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
```

## 2) Environment variables

Create a `.env.local` file:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_SECRET=choose_a_long_password
```

## 3) Install and run locally

```bash
npm install
npm run dev
```

Open:
- Home: `/`
- Admin: `/admin`

## 4) Deploy on Vercel

1. Push this project to GitHub
2. Import the repo into Vercel
3. Add the same environment variables in Vercel
4. Deploy

## Notes

- Public users can only view data.
- Only the admin page can add records.
- This uses a lightweight prediction formula, not a trained machine-learning model.
- You can later replace the formula with a real trained model if you upload historical exam results.

## Suggested next upgrade

Add:
- login authentication for the admin
- CSV upload
- charts
- student ID-only search
- actual trained ML model