export interface Student {
  id: any;
  birthDate: number;
  birthPlace: string;
  isConfirmedBySupervisor: boolean;
  email: string;
  firstName: string;
  gender: string;
  idCard: string;
  isA2A3: boolean;
  isEAlbaniaApplication: boolean;
  lastName: string;
  middleName: string;
  mobilePhone: string;
  oldId: string;
  highSchool?: string;
  schoolFinished: string;
  schoolName: string;
  schoolProfile?: string;
  session: string;
  studentId: string;
  studyClass: string;
  graduationYear?: string;
  isFall: boolean;
  registrationYear?: string;
}

export interface StudentTableView {
  data: Student[];
  total: number;
}

