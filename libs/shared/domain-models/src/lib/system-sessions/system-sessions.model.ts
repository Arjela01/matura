export interface SystemSessionsModel {
  id?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  lastAccessTime?: Date;
  expirationTime?: Date;
}
export interface SystemSessionsView {
  data: SystemSessionsModel[];
  total: number;
}
