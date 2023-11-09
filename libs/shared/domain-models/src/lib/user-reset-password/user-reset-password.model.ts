export interface UserResetPasswordModel {
  newPassword: string;
  confirmPassword: string;
  children?: UserResetPasswordModel[];
}
