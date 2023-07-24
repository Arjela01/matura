export interface ArchiveExam {
  id:any;
  index?: number;
  archiveFolderId: number;
  archiveFolderNr: number;
  barcode?: string;
  isFall?: boolean;
}

export interface ArchiveExamView {
  data: ArchiveExam[];
  total: number;
}
