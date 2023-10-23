export interface ExamGradeDiscoveryResult
{
  isFound: boolean;
  grade?: number;
  studentId?: string;
  examTypeId?: number;
  examGradeId?: string;
  carriedGradeId?: number;
  isManuallyCarried?: boolean;
}
