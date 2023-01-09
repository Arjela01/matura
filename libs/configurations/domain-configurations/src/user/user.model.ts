export interface User {
  id: number;

  displayName: string;

  administrationOffice: string;

  universityDepartment: string;

  fileName: string;

  highSchool: string;

  lastName: string;

  lastPasswordChange: string;

  name: string;

  overseerCode: string;

  studentId: string;

  studyProgramId: number;

  universityId: number;

  validFrom?: Date;

  validTo?: Date;
}

export interface UserTableView {
  data: User[];
  total: number;
}
