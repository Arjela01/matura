export interface UserProfile {
  id: string;
  administrationOfficeId: string;
  administrationOfficeName: string;
  dateDisabled: Date;
  lastPasswordChange: Date;
  name: string;
  overseerCode: string;
  studentId: string;
  universityDepartmentId: number;
  universityDepartmentName: string;
  highSchoolId: number;
  highSchoolName: string;
  studyProgramId: number;
  studyProgramName: number;
  universityId: number;
  universityName: string;
  nid: string;
  lastLoginTime: Date;
  isDisabled: boolean;
  firstName: string;
  lastName: string;
  username: string;
  roleId: string;
  roleName: string;
  email: string;
  children: UserProfile[];
}
