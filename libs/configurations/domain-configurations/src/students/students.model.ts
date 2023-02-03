export interface Student {
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
  registrationYearId?: number;
  schoolFinishedName: string;
  createdOn: Date;
  createdName: string;
  modifiedOn?: Date;
  modifiedByName?: string;
}

export interface StudentTableView {
  data: Student[];
  total: number;
}
