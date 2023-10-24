export interface LoginResponse {
  displayName: string;
  token: string;
  username: string;
  permissions: string[];
  isSuccessful: boolean;
  errorMessage?: string;
}
