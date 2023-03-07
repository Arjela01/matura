export interface ExamCopy {
  applicationId?: string;
  maturaId?: string;
  nid?: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  gender?: string;
  dateOfBirth?: string;
  email?: string;
  cel?: string;
  telFix?: string;
  placeOfBirth?: string;
  nationality?: string;
  region?: string;
  city?: string;
  address?: string;
  municipalityUnit?: string;
  postalCode?: string;
  schoolName?: string;
  schoolCode?: string;
  administrationOffice?: string;
  service?: string;
  comments?: string;
  remarks?: string;
  subject?: string;
  attachedDocument?: string;
  documentName?: string;
  status?: number;
  decisionDate?: string;
}

export interface ExamCopyTableView {
  total: number;
  data: ExamCopy[];
}
