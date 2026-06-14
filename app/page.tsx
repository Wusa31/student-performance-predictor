"use client";

import { useEffect, useMemo, useState } from "react";
import type { StudentRecord } from "@/lib/types";

function badgeClass(level: StudentRecord["risk_level"]) {
  if (level === "High") return "bg-red-100 text-red-700 border-red-200";
  if (level === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecords(search = "") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/students${search ? `?q=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load records");
      setRecords(data.records ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredCount = useMemo(() => records.length, [records]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-white/90 p-8 shadow-soft ring-1 ring-slate-200/70 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Academic integrity dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Student performance prediction
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Enter attendance and test scores, then the system predicts the likely exam score and highlights unusual patterns for review.
            </p>
          </div>

          <form
            className="flex w-full max-w-md gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              loadRecords(query);
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or matric no."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Total records</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Use case</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Attendance + tests → prediction</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Access</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Public view, admin upload</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-200/70">
            Loading records...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-200/70">
            No records yet. Use the admin page to add the first student.
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <article key={record.id} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200/70">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{record.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{record.matric_no}</p>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{record.notes}</p>
                  </div>
                  <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-medium ${badgeClass(record.risk_level)}`}>
                    {record.risk_level} risk
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-5">
                  <Stat label="Attendance" value={`${record.attendance}%`} />
                  <Stat label="Test 1" value={`${record.test1}%`} />
                  <Stat label="Test 2" value={`${record.test2}%`} />
                  <Stat label="Test 3" value={`${record.test3}%`} />
                  <Stat label="Predicted exam" value={`${record.predicted_exam_score}%`} emphasis />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  emphasis = false
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${emphasis ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${emphasis ? "text-blue-700" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}