export interface StudentBan {
  id: number;
  studentId: string;
  studentInputData: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  description: string;
  isBanned: number;
  effectiveDate: Date;
  banRemovalDate: Date;
  barcode: string;
  examTypeId: number;
  examTypeName: string;
  isFall: boolean;
}

export interface StudentBanTableView {
  data: StudentBan[];
  total: number;
}
