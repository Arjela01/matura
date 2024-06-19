export interface EAlbaniaMessage {
  id?: number;
  topic?: string;
  messageSender?: string;
  content?: string;
  userEmail?: string;
  isApproved?: boolean;
  approvalDate?: Date;
  isDelivered?: boolean;
  deliveryDate?: Date;
  isDeliveryError?: boolean;
  deliveryErrorDate?: Date;
  deliveryError?: string;
  studentId?: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentLastName?: string;
  examTypeId?: number;
  examTypeName?: number;
  academicYearId?: number;
  academicYearName?: string;
}
