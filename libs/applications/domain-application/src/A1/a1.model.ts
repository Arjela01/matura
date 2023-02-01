export interface A1 {
  id: string;
  academicYearId: string | undefined;
  studentId: string;
  studentFirstName?: string;
  studentFatherName?: string;
  studentLastName?: string;
  nid?: string;
  subjectD3Id: string;
  isApplyingToForeignCountries: boolean;
  alreadyHaveDiploma: boolean;
  studentIdentifier?: string;
  studentOldIdentifier?: string;
  isA1: boolean;
  isFall?: boolean;
  subjectZ1Id?: string;
  subjectZ1Name?: string;
  subjectZ2Id?: string | null;
  subjectZ2Name?: string | null;
  subjectZ3Id?: string | null;
  subjectZ3Name?: string | null;
  overSeerCode: string;
}
