export interface Diploma {
  id: number;
  studentId?: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  studentIdCard: string;
  countryId?: number;
  countryName?: string;
  averageGrade?: number;
  isPrinted?: boolean;
  printedDate?: Date;
  isDelivered?: boolean;
  deliveryDate?: Date;
  isSealError?: boolean;
  isDeliveryError?: boolean;
  errorDate?: Date;
  error?: string;
  academicYearId?: number;
  academicYearIsActive?: boolean;
  academicYearName?: string;
  highSchoolId?: number;
  highSchoolName?: string;
  administrationOfficeId?: number;
  administrationOfficeName?: string;
}

export interface DiplomaTableView {
  data: Diploma[];
  total: number;
}
