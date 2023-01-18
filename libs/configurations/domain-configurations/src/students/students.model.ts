export interface Student {
  id?: any;
  birthDate: number;
  birthPlace: string;
  isConfirmedBySupervisor: boolean;
  email: string;
  firstName: string;
  genderId?: string;
  highSchoolId?: string;
  idCard: string;
  isA2A3: boolean;
  isEAlbaniaApplication: boolean;
  lastName: string;
  middleName: string;
  mobilePhone: string;
  highSchool: string;
  oldId: string;
  schoolName: string;
  schoolFinished: string;
  schoolProfile?: string;
  session?: string;
  studentId: string;
  studyClass?: string;
  graduationYear?: number;
  highSchoolName?: string;
  isFall: boolean;
  registrationYear?: string;

}

export interface StudentTableView {
  data: Student[];
  total: number;

}

