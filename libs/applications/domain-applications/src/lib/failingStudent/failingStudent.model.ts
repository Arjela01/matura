export interface FailingStudent {
  id?: number;

  student?: number;

  subject?: string;

  willRetryInFall?: boolean;

  firstName?: string;

  lastName?: string;

  middleName?: string;

  studentIdentifier?: number;

  personalIdentifier?: number;

  schoolName?: string;
}

export interface FailingStudentTableView {
  data: FailingStudent[];
  total: number;
}
