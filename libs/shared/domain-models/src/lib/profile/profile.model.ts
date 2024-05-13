export interface Profile {
  id: number;
  code: string;
  name: string;
  isTechnical: boolean;
  d1Coefficient?: number;
  d2Coefficient?: string;
  academicYearId?: number;
  academicYear?: string;
  profileGroupID?: string;
  profileGroupName?: string;
  assignmentPriority?: number;
}

export interface ProfileTableView {
  data: Profile[];
  total: number;
}
