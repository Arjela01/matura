import { SharedStudent } from '@msh/shared/student-lookup';
export interface Student extends SharedStudent {
  id?: any;
  birthDate: Date;
  birthPlace: string;
  email: string;
  firstName: string;
  genderId?: number;
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
  session?: string;
  studentId: string;
  studyClass?: string;
  graduationYear?: number;
  highSchoolName: string;
  isFall: boolean;
  registrationYearId?: number | undefined;
  schoolFinishedName: string;
  createdOn: Date;
  createdName: string;
  modifiedOn?: Date;
  modifiedByName?: string;
  nid?: string;

}

export interface StudentTableView {
  data: Student[];
  total: number;
}
export interface ConfirmDiplomaException {
  id: string,
  isConfirmed: boolean,
}
export interface FileImport {
  file: string | ArrayBuffer | null;
}
