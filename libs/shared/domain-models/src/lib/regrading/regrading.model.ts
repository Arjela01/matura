export interface Regrading {
  id?: number;
  maturaId?: string;
  studentID?: string;
  nid?: string;
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  grade?: number;
  score?: number;
  examGradeId?: string;
  administrationOfficeName?: string;
  administrationOfficeId?: number;
  schoolName?: string;
  schoolId?: number;
  academicYearId?: number;
  academicYearName?: string;
  academicYearIsActive?: true;
  status?: number;
  examTypeName?: string;
  examTypeId?: number;
  examSubjectName?: string;
  examSubjectId?: string;
  file?: any;
  comments?: string;
  barcode?: string;
}

export interface RegradingTableView {
  data: Regrading[];
  total: number;
}

export interface RegradingImportCommand {
  file?: any;
}

export interface RegradingUpdate {
  academicYearId?: 0;
  regradingRequestID?: number;
  statusEnum?: RegradingStatuses;
  comments?: string;
}

export interface RegradingStatuses {
  id?: number;
  displayText?: RegradingStatus;
}

export enum RegradingStatus {
  Draft = 1,
  Accepted,
  Declined,
}
