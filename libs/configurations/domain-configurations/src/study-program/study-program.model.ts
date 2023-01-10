export interface StudyProgram {
  id: number;

  name: string;

  code: string;

  isTwoYearLong: number;

  minAverageGrade: number;

  quota: number;

  usedQuota: number;

  academicYear: number;

  university: number;

  universityDepartament: number;

  fullName: string;

  maturaCoefficient: number;

  isWithCompetition: boolean;

  isValidForRace: boolean;

  competitionMaxScore?: number;

  competitionMinScore?: number;

  competitionCoefficient?: number;

  studentScores: number;
}

export interface StudyProgramsTableView {
  data: StudyProgram[];
  total: number;
}
