export interface ExamSecretList{
  administrationOfficeId: number;
  administrationOfficeName: string;
  examSiteName: string;
  examSiteId: any;
  examDateId: number;
  examSecretId?: string,
  examSecretName?: string;
  examTypeDateTime?:Date;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  studentName?:string;
  studentId?:number;
  isFall?:boolean;
  barcode?:any;

}
