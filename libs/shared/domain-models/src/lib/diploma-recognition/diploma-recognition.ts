export interface DiplomaRecognition {
  id: string;
  idCard: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  genderID: number;
  genderName: string;
  dateOfBirth: Date;
  countryOfBirthID: number;
  countryOfBirthName: string;
  nationalityID: number;
  nationalityName: string;
  email: string;
  cel: string;
  telFix: string;
  municipality: string;
  city: string;
  address: string;
  postalCode: string;
  isRecognitionAndEquivalency: boolean;
  schoolName: string;
  schoolWebSite: string;
  schoolEmail: string;
  schoolTelFix: string;
  schoolPostalCode: string;
  schoolAddress: string;
  schoolCity: string;
  diplomaName: string;
  yearsOfStudy: number;
  schoolStartDate: Date;
  schoolGraduationDate: Date;
  diplomaRecognitionsRequestStatusID: number;
  diplomaRecognitionsRequestStatusName: string;
  files?: DiplomaRecognitionFiles[];
}
export interface DiplomaRecognitionView {
  data: DiplomaRecognition[];
  total: number;
}

export interface DiplomaRecognitionDocuments {
  requestId?: number;
  files?: DiplomaRecognitionFiles[];
}

export interface DiplomaRecognitionFiles {
  id?: number;
  data: string;
  fileName: string;
  mimeType: string;
}
