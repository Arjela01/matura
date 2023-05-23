export interface ExamAssignment {
  id: string;
  studentId:string;
  studentIdentifier: string;
  studentName: string;
  examDateId: number;
  date: Date;
  studentInputData: string;
  examSiteId: string;
  examSiteName?:string;
  examTypeDateTime?: string;
  takenSeats?: number;
  examTypeId? : number;
  examTypeName? : string;
  administrationOfficeId?:string;
  administrationOfficeName?:string;
  time: string;
}

export interface ExamAssignmentTableView {
  data: ExamAssignment[];
  total: number;
}
