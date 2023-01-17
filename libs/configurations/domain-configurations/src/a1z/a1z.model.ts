export interface A1Z {
  id: number;
  academicYear: string;
  studentFirstName: string;
  studentFatherName: string;
  studentLastName: string;
  nid: string;
  studentIdentifier: string;
  studentOldIdentifier: string;
  studentBirthDate: string;
  studentBirthPlace: string;
  isApplyingToForeignCountries: boolean;
  isA1: string;
  createdOn: string;
}

export interface A1ZTableView {
  data: A1Z[];
  total: number;
}
