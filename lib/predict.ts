import type { StudentInput } from "@/lib/types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const round = (value: number) => Math.round(value * 10) / 10;

export function predictExamScore(input: StudentInput) {
  const avgTest = (input.test1 + input.test2 + input.test3) / 3;
  const weightedCore = avgTest * 0.62 + input.attendance * 0.33;
  const consistency = Math.abs(input.test1 - avgTest) + Math.abs(input.test2 - avgTest) + Math.abs(input.test3 - avgTest);
  const consistencyPenalty = consistency > 40 ? 4 : consistency > 24 ? 2 : 0;
  const base = 4.5;
  const predicted = clamp(weightedCore + base - consistencyPenalty);

  let risk_level: "Low" | "Medium" | "High" = "Low";
  const lowAttendance = input.attendance < 60;
  const weakTests = avgTest < 55;
  const poorPattern = input.attendance < 45 || avgTest < 45;

  if (poorPattern || (lowAttendance && weakTests)) {
    risk_level = "High";
  } else if (input.attendance < 75 || avgTest < 70) {
    risk_level = "Medium";
  }

  const notes = [
    `Attendance: ${input.attendance}%`,
    `Average test score: ${round(avgTest)}%`,
    `Model prediction: ${round(predicted)}%`
  ].join(" • ");

  return {
    predicted_exam_score: round(predicted),
    risk_level,
    notes
  };
}