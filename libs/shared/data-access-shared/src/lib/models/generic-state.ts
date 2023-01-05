export type GenericStoreStatus =
  | 'pending'
  | 'loading'
  | 'success'
  | 'error'
  | 'initial'
  | 'saving'
  | 'savingSuccessful'  ;

export interface GenericState<T> {
  data: T | null;
  status: GenericStoreStatus;
  error: string | null;
}
