export interface ExamAssignment {
  index?: number;
  id: string;
  studentId: string;
  studentIdentifier: string;
  studentName: string;
  examDateId: number;
  date: Date;
  studentInputData: string;
  examSiteId: any;
  examSiteName?: string;
  examTypeDateTime?: string;
  takenSeats?: number;
  examTypeId?: number;
  examTypeName?: string;
  administrationOfficeId?: number;
  administrationOfficeName?: string;
  time: string;
  studentHighSchoolName?: string;
}

export interface ExamAssignmentTableView {
  data: ExamAssignment[];
  total: number;
}
