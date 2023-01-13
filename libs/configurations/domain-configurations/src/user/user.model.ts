export interface User {
  id: number;

  displayName?: string;

  administrationOfficeId?: number;

  universityDepartmentId?: number;

  fileName: string;

  highSchool?: string;

  lastName: string;

  lastPasswordChange: Date;

  name: string;

  overseerCode: string;

  studentId?: string | null;

  studyProgramId?: number;

  universityId: number;

  validFrom?: Date;

  validTo?: Date;

  userName: string;

  password: string;
}

export interface UserTableView {
  data: User[];
  total: number;
}
