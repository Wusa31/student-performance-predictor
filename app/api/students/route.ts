import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { predictExamScore } from "@/lib/predict";
import type { StudentInput, StudentRecord } from "@/lib/types";

function isValidScore(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isValidInput(body: Partial<StudentInput>): body is StudentInput {
  return (
    typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    typeof body.matric_no === "string" &&
    body.matric_no.trim().length >= 3 &&
    isValidScore(body.attendance) &&
    isValidScore(body.test1) &&
    isValidScore(body.test2) &&
    isValidScore(body.test3)
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.trim() ?? "";
    const supabase = getSupabaseAdminClient();

    let query = supabase
      .from("student_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,matric_no.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ records: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.headers.get("x-admin-token");
    if (!process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "ADMIN_SECRET is not set" }, { status: 500 });
    }

    if (adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<StudentInput>;
    if (!isValidInput(body)) {
      return NextResponse.json({ error: "Invalid student data" }, { status: 400 });
    }

    const input: StudentInput = {
      name: body.name.trim(),
      matric_no: body.matric_no.trim().toUpperCase(),
      attendance: Number(body.attendance),
      test1: Number(body.test1),
      test2: Number(body.test2),
      test3: Number(body.test3)
    };

    const prediction = predictExamScore(input);
    const supabase = getSupabaseAdminClient();

    const payload = {
      name: input.name,
      matric_no: input.matric_no,
      attendance: input.attendance,
      test1: input.test1,
      test2: input.test2,
      test3: input.test3,
      predicted_exam_score: prediction.predicted_exam_score,
      risk_level: prediction.risk_level,
      notes: prediction.notes
    };

    const { data, error } = await supabase
      .from("student_records")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ record: data as StudentRecord }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}