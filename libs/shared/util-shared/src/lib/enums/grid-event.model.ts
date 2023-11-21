export enum GRID_ACTIONS {
  DELETE,
  EDIT,
  SELECT_MANY,
  UNSELECT_ALL,
  SELECT_ROW,
  UNSELECT_ROW,
  ACCEPT,
  REJECT,
  CHANGE,
  CUSTOM_ACTION1,
  CUSTOM_ACTION2,
  PRINT,
  HISTORY,
  SEAL,
  ADD,
}

export interface GridEvent<T> {
  action: GRID_ACTIONS;
  data?: T;
}
