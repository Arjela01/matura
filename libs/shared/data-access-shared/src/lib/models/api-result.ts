export interface BaseApiResult {
  isSuccessful: boolean;
  isBadRequest: boolean;
  errorMessage: string;
}

export interface ApiResult<T> extends BaseApiResult {
  data: T;
}
