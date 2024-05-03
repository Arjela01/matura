export interface ArchiveExam {
  id: any;
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

export const statuses = [
  { label: 'Hapur', value: false },
  { label: 'Mbyllur', value: true },
];
