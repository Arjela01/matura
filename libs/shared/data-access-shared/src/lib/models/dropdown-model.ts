export interface DropdownModel<T> {
  key: T | null;
  value: string;
  parentKey?: any;
  additionalValue?: string;
}
