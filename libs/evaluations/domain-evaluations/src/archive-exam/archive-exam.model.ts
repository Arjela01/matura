export interface ArchiveExam {
  id?:any;
  index?: number;
  archiveFolderId: number;
  barcode?: string;
  totalArchiveExams?: 0;
}

export interface ArchiveExamView {
  data: ArchiveExam[];
  total: number;
}
