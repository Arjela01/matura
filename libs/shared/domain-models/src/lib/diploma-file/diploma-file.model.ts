export interface IDiplomaFile {
  studentVersion: StudentVersion;
  schoolId: number;
  darZaId: number;
  studentId: string;
  isForeign: boolean;
  isProfessional: boolean;
  isPrinted: boolean;
}

export enum StudentVersion {
  CurrentStudent = 1,
  PreviousStudent = 2,
}
