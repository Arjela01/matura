export interface ArchiveExam {
  id:any;
  index?: number;
  archiveFolderId: number;
  barcode?: string;
  totalArchiveExams?: 0;
  examSubjectName?:string;
}

export interface ArchiveExamView {
  data: ArchiveExam[];
  total: number;
}
