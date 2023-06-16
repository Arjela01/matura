
export interface ArchiveFolder{
  nr?: any;
  id?: any;
  examTypeId?: number;
  examTypeName?: string;
  totalArchiveExams?: number;
  examSubjectId?: string;
  examSubjectName?: string;
  academicYearID?: number;
  academicYearName?: string;
  isClosed?: boolean;
  lastUserId?: any;
  profileGroupId?: string;
  profileGroupName?: string;
  barcode?: number;
}

export interface ArchiveFolderTableView{
  data: ArchiveFolder [];
  total: number;
}
export interface ArchiveFolderBarcodeCorrection{
  data: ArchiveFolder [];
  total: number;
}
