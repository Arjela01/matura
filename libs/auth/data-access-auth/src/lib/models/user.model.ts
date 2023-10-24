export interface User {
  displayName: string;
  username: string;
  permissions: string[];
}

export const USER_STORAGE_KEY = 'user';
