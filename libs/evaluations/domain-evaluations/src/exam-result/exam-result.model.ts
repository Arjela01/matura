export interface ExamResult {
  id: number;
  student_id?: string;
  barcode?: string;
  elaboration_points: number;
  alternative_points?: number;
  exam_type_id?: number;
  exam_type?: string;
  subject?: string;
  reason?: string;
  has_document?: string;
  document_name?: string;
}

export interface HighSchoolTableView {
  data: ExamResult[];
  total: number;
}
