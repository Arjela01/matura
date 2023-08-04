export interface ExamScores {
  id?: any;
  archiveFolderId?: number;
  archiveFolderNr?: any;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  barcode?: string;
  writingScore?: number;
  hasWritingScore?: boolean;
}

export interface ExamScoresView {
  data: ExamScores[];
  total: number;
}
