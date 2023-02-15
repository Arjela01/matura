export interface AnnualGrades {
  id:any;
  birthDate: Date;
  firstName: string;
  genderId?: number;
  highSchoolId?: number;
  studentId: string;
  idCard?: string;
  lastName?: string;
  school?:string;
  middleName?: string;
  highSchool?: string;
  schoolName?: string;
  genderName?: string;
  highSchoolName?: string;
  formTypeId?: number;
  formTypeName:string;
  creationDate: Date;
  nid?: string;
  formularType?: string;
}

export interface AnnualGradesView {
  data: AnnualGrades[];
  total: number;
}
