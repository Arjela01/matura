export interface StudyProgram {
  id: number;

  name: string;

  code: string;

  isTwoYearLong: number;

  minAverageGrade: string;

  academicYearId?: number;

  quota: string;

  usedQuota: string;

  universityId: string;

  universityDepartmentId: string;

  fullName?: string;

  maturaCoefficient: string;

  isWithCompetition: boolean;

  isValidForRace: boolean;

  competitionMaxScore?: string;

  competitionMinScore?: string;

  competitionCoefficient?: string;

  studentScores: string;

  dropDownName: string;
}

export interface StudyProgramsTableView {
  data: StudyProgram[];
  total: number;
}
