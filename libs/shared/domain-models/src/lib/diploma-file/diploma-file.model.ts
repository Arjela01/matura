export interface IDiplomaFile {
  studentType: StudentType;
  schoolId: number;
  darZaId: number;
  studentId: string;
  isForeign: boolean;
  isProfessional: boolean;
  isPrinted: boolean;
}

export enum StudentType {
  CurrentStudent = 0,
  PreviousStudent = 1,
}

export enum Status {
  NOTPRINTED,
  PRINTED,
}
