export type StudentRecord = {
  id: string;
  name: string;
  matric_no: string;
  attendance: number;
  test1: number;
  test2: number;
  test3: number;
  predicted_exam_score: number;
  risk_level: "Low" | "Medium" | "High";
  notes: string;
  created_at: string;
};

export type StudentInput = {
  name: string;
  matric_no: string;
  attendance: number;
  test1: number;
  test2: number;
  test3: number;
};