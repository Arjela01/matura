export interface GradeListPublicationCurrentRecord {
  id: number;
  academicYearId: number;
  academicYearIsActive: boolean;
  academicYearName: string;
  gradeListPublicationId: number;
  actionType: string;
  gradeId: string;
  oldID: string;
  idCard: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  gender: string;
  birthDate: Date;
  birthPlace: string;
  isFall: boolean;
  isApplyingToForeignCountries: boolean;
  highSchoolCode: string;
  highSchoolName: string;
  legacySchoolName: string;
  profileCode: string;
  applicationFormType: string;
}

export interface GradeListPublicationCurrentRecordView {
  data: GradeListPublicationCurrentRecord[];
  total: number;
}
