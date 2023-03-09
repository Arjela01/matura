export interface User {
  id: any;

  displayName?: string;

  administrationOfficeId?: number;

  universityDepartmentId?: number;

  fileName: string;

  highSchool?: string;

  lastName: string;

  lastPasswordChange?: Date;

  name: string;

  overseerCode: string;

  roleId: string;

  studentId?: string | null;

  studyProgramId?: number;

  universityId: number;

  username?: string;
  isDisabled: boolean;
  password: string;
  nid: string;
}

export interface UserTableView {
  data: User[];
  total: number;
}

export interface ChangeUserStatusDto {
  id: string;
  isDisabled: boolean;
}
