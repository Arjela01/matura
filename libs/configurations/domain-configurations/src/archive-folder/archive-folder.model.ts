
export interface ArchiveFolder{
  id: any;
  examTypeId: number;
  isClosed: boolean;
  examSubjectId: number;
}

export interface ArchiveFolderTableView{
  data: ArchiveFolder [];
  total: number;
}
