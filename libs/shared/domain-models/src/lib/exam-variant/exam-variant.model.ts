export interface ExamVariant {
  name: string
  numberOfQuestions: number
  maximumScore: number
  examSubjectId: string
  examSubjectName?: string
  examVariantAcademicYearId:any
  examTypeId: number
  examTypeName?: string
  profileGroupId: number|null
  profileGroupName?: string
  profileId: any
  profileName?: any
  academicYearName?: string
  id?: any
}

export interface ExamVariantTableView {
  data: ExamVariant[];
  total: number;
}
