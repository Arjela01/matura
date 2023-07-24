export interface ApiResult<T> {
  isSuccessful: boolean;
  isBadRequest: boolean;
  errorMessage: string;
  data: T;
}
