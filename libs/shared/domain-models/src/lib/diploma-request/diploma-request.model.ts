export interface DiplomaRequest {
  id: string;
  studentId?: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  studentNID: string;
  isApproved?: boolean;
  approvalDate?: Date;
  isDelivered?: boolean;
  deliveryDate?: Date;
  eAlbaniaDocumentResponse?: string;
  studentInputData?: string;
  attachedDocument?: string;
  fileName?: string;
  attachedDocumentFileName?: string;
}

export interface DiplomaRequestTableView {
  data: DiplomaRequest[];
  total: number;
}

export interface DiplomaRequestPostData {
  attachedDocument?: string;
  fileName?: string;
  studentID?: string;
  academicYearId?: number;
}
