export interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  roleId:string;
  roleName:string;
  isActive:boolean;
  email:string;
  children: UserProfile[];
}
