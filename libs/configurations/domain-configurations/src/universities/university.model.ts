export interface UniversityDepartment {
  id: string;
  name: string;
  universityId: number;
  universityName: string;
}
export interface UniversityDepartmentTableView {
  data: UniversityDepartment[];
  total: number;
}
