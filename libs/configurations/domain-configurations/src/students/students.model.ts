export interface Student {
  id?: any;
  birthDate: Date;
  birthPlace: string;
  isConfirmedBySupervisor: boolean;
  email: string;
  firstName: string;
  genderId?: number;

  highSchoolId?: number;
  idCard?: string;
  isA2A3: boolean;
  isEAlbaniaApplication: boolean;
  lastName: string;
  middleName: string;
  mobilePhone: string;
  highSchool: string;
  oldId: string;
  schoolName: string;
  genderName: string;
  schoolFinished: number;
  schoolProfile: string;
  profileId?: number;
  profileName: string;
  session?: string;
  studentId: string;
  studyClass?: string;
  graduationYear?: number;
  highSchoolName: string;
  isFall: boolean;
  registrationYear?: string;
  schoolFinishedName: string;

}

export interface StudentTableView {
  data: Student[];
  total: number;

}

