export interface StudySubject {
  id: number;

  code: string;

  name: string;
}

export interface StudySubjectTableView {
  data: StudySubject[];
  total: number;
}
