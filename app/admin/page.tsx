"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { StudentInput } from "@/lib/types";

const initialForm: StudentInput = {
  name: "",
  matric_no: "",
  attendance: 0,
  test1: 0,
  test2: 0,
  test3: 0
};

export default function AdminPage() {
  const [form, setForm] = useState<StudentInput>(initialForm);
  const [adminSecret, setAdminSecret] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof StudentInput>(key: K, value: StudentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminSecret
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save student");

      setMessage(`Saved successfully. Predicted exam score: ${data.record.predicted_exam_score}%`);
      setForm(initialForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-200/70">
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          Admin upload only
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Add student record</h1>
        <p className="mt-3 text-slate-600">
          This page is for the authorised uploader only. Public users can view records but cannot edit them.
        </p>

        <form onSubmit={submitForm} className="mt-8 grid gap-4">
          <input
            type="password"
            placeholder="Admin secret"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Student name">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </Field>
            <Field label="Matric no">
              <input
                value={form.matric_no}
                onChange={(e) => updateField("matric_no", e.target.value.toUpperCase())}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </Field>
            <NumberField label="Attendance %" value={form.attendance} onChange={(v) => updateField("attendance", v)} />
            <NumberField label="Test 1 %" value={form.test1} onChange={(v) => updateField("test1", v)} />
            <NumberField label="Test 2 %" value={form.test2} onChange={(v) => updateField("test2", v)} />
            <NumberField label="Test 3 %" value={form.test3} onChange={(v) => updateField("test3", v)} />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save student"}
          </button>

          {message ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
              {message}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        required
      />
    </label>
  );
}