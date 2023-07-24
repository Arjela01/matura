export type GenericStoreStatus =
  | 'pending'
  | 'loading'
  | 'success'
  | 'error'
  | 'initial'
  | 'saving'
  | 'deleting';

export interface GenericState<T> {
  data: T | null;
  status: GenericStoreStatus;
  error: string | null;
}
