
export interface AcademicYear {
  id: number;
  year: string;
  isFall: boolean;
  isActive: boolean;
}
export interface AcademicYearTableView {
  data: AcademicYear[];
  total: number;
}
