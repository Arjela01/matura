export interface StudyProgram {
  id: number;

  name: string;

  code: string;

  isTwoYearLong: number;

  minAverageGrade: number;

  quota: number;

  usedQuota: number;

  academicYearId: number;

  universityId: number;

  universityDepartmentId: number;

  fullName?: string;

  maturaCoefficient: number;

  isWithCompetition: boolean;

  isValidForRace: boolean;

  competitionMaxScore?: number;

  competitionMinScore?: number;

  competitionCoefficient?: number;

  studentScores: number;

  dropDownName: string;
}

export interface StudyProgramsTableView {
  data: StudyProgram[];
  total: number;
}
