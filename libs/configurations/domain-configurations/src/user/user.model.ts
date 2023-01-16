export interface User {
  id: string;

  displayName?: string;

  administrationOfficeId?: number;

  universityDepartmentId?: number;

  fileName: string;

  highSchool?: string;

  lastName: string;

  lastPasswordChange: Date;

  name: string;

  overseerCode: string;

  roleId: string;

  studentId?: string | null;

  studyProgramId?: number;

  universityId: number;

  isActive: boolean;

  userName: string;

  password: string;
}

export interface UserTableView {
  data: User[];
  total: number;
}
