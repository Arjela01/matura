export interface User {
  id: any;
  displayName?: string;
  administrationOfficeId?: number;
  universityDepartmentId?: number;
  fileName?: string;
  highSchool?: string;
  lastName?: string;
  lastPasswordChange?: Date;
  overseerCode: string;
  roleId: string;
  name?: string;
  studentId?: string | null;
  studyProgramId?: number;
  universityId: number;
  highSchoolId?: number;
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
