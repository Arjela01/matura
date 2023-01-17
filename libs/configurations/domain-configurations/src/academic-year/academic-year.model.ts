
export interface AcademicYear {
  id: string;
  year: string;
  isFall: boolean;
  isActive: boolean;
}
export interface AcademicYearTableView {
  data: AcademicYear[];
  total: number;
}
