export interface ExamAssignment {
  id: number;
  studentId:string;
  studentIdentifier: string;
  studentName: string;
  examDateId: number;
  date: Date;
  studentInputData: string;
  examSiteId?: number;
  examSiteName?:string;
  examTypeDateTimeId?: number;
  examTypeDateTime?: string;
  takenSeats?: number;
}

export interface ExamAssignmentTableView {
  data: ExamAssignment[];
  total: number;
}
