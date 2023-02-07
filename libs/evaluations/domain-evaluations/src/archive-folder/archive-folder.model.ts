
export interface ArchiveFolder{
  nr?: number;
  id?: any;
  examTypeId?: number;
  examTypeName?: string;
  totalArchiveExams?: number;
  examSubjectId?: string;
  examSubjectName?: string;
  academicYearId?: number;
  academicYearName?: string;
  isClosed?: boolean;
  lastUserId?: any;
  profileGroupId?: string;
  profileGroupName?: string;
}

export interface ArchiveFolderTableView{
  data: ArchiveFolder [];
  total: number;
}
