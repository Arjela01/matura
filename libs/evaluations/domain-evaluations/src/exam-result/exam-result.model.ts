export interface ExamResult {
  id: number;
  student_id?: string;
  barcode?: string;
  elaboration_points: number | undefined;
  alternative_points: number | undefined;
  exam_type_id?: number;
  exam_type?: string;
  subject?: string;
  reason?: string;
  has_document?: string;
  document_name?: string;
}

export interface ExamResultView {
  data: ExamResult[];
  total: number;
}
