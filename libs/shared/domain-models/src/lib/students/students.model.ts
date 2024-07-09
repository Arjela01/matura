import { SharedStudent } from '@msh/shared/student-lookup';
export interface Student extends SharedStudent {
  id?: any;
  birthDate: Date;
  birthPlace: string;
  email: string;
  firstName: string;
  genderId?: number;
  fullName?: string;
  highSchoolId?: number;
  idCard?: string;
  isA2A3: boolean;
  isEAlbaniaApplication: boolean;
  isConfirmedBySupervisor?: boolean;
  lastName: string;
  middleName: string;
  mobilePhone: string;
  highSchool: string;
  oldID: string;
  schoolName: string;
  genderName: string;
  schoolFinished: string;
  schoolProfile: string;
  profileId?: number;
  profileName: string;
  session?: any;
  studentId: string;
  studyClass?: any;
  graduationYear?: number;
  highSchoolName: string;
  isAN?: boolean;
  isFall: boolean;
  registrationYearId?: number | undefined;
  schoolFinishedName: string;
  createdOn: Date;
  createdName: string;
  modifiedOn?: Date;
  modifiedByName?: string;
  nid?: string;
  isA1?: boolean;
  isDiplomaRequirementException?: boolean;
  countryId?: number;
  registrationYear?: string;
  averageGrade?: string;
  administrationOfficeName?: string;
}

export interface StudentTableView {
  data: Student[];
  total: number;
}
export interface ConfirmDiplomaException {
  id: string;
  isConfirmed: boolean;
}
export interface FileImport {
  file: string | ArrayBuffer | null;
}
