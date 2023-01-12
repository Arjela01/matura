export interface Profile {
  id: number;
  code: string;
  name: string;
  IsTechnical: boolean;
  D1Coefficient?: number;
  D2Coefficient?: string;
  AcademicYear?: number;
  ProfileGroup?: string;
}

export interface ProfileTableView {
  data: Profile[];
  total: number;
}
