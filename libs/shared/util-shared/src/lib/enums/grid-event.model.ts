export enum GRID_ACTIONS {
  DELETE,
  EDIT,
  SELECT_MANY,
  UNSELECT_ALL,
  SELECT_ROW,
  UNSELECT_ROW,
  ACCEPT,
  REJECT,
}

export interface GridEvent<T> {
  action: GRID_ACTIONS;
  data?: T;
  type?: string;
}
