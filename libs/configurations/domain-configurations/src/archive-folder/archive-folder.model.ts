
export interface ArchiveFolder{
  id: number;
  examTypeId: number;
  // examSubjectId?: any;
}

export interface ArchiveFolderTableView{
  data: ArchiveFolder [];
  total: number;
}
