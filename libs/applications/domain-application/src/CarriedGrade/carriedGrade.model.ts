export interface CarriedGrade {
  id: number;
  nid: string;
  examTypeId: number;
  examTypeName: string;
  examSubject: string;
  year: number;
  grade: number;
  document: string;
}

export interface CarriedGradeTable {
  data: CarriedGrade[];
  total: number;
}
