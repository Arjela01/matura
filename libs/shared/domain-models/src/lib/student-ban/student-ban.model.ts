export interface StudentBan{
  id: number;
  studentId: string;
  studentIdentifier: string;
  studentName: string;
  description: string;
  isBanned: number;
  effectiveDate: Date;
  banRemovalDate:Date;

}

export interface StudentBanTableView {
  data: StudentBan[];
  total: number;
}
