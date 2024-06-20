export interface AcademicYear {
  id: number;
  year: string;
  isFall: boolean;
  isActive: boolean;
  directorName?: string;
}

export interface AcademicYearTableView {
  data: AcademicYear[];
  total: number;
}
