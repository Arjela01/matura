export interface IDiplomaFile {
  studentType: StudentType;
  schoolId: number;
  darZaId: number;
  studentId: string;
  isForeign: boolean | '';
  isProfessional: boolean;
  isPrinted: boolean;
}

export enum StudentType {
  PreviousStudent = 0,
  CurrentStudent = 1,
}

export enum Status {
  NOTPRINTED,
  PRINTED,
}
export enum DiplomaStatus {
  Completed,
  Failed,
  InProgress,
  New,
  Started,
}
export interface DiplomaStatusData {
  data: DiplomaStatus;
}
