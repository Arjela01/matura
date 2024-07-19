export interface StudentListPublication {
  id: number;
  isPublished: boolean;
  publishDate?: Date;
  academicYearId: number;
  academicYearIsActive: boolean;
  academicYearName: string;
}

export interface StudentListPublicationView {
  data: StudentListPublication[];
  total: number;
}
