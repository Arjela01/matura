export interface UserResetPasswordModel {
  password: string;
  newPassword: string;
  confirmPassword: string;
  children?: UserResetPasswordModel[];
}
