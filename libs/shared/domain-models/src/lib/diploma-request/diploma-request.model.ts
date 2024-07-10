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
}

export interface DiplomaRequestTableView {
  data: DiplomaRequest[];
  total: number;
}
