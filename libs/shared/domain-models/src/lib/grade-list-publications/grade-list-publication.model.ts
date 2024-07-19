export interface GradeListPublication {
  id: number;
  isPublished: boolean;
  publishDate?: Date;
  academicYearId: number;
  academicYearIsActive: boolean;
  academicYearName: string;
}

export interface GradeListPublicationView {
  data: GradeListPublication[];
  total: number;
}
