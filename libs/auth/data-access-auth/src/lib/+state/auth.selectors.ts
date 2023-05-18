import { createSelector } from '@ngrx/store';
import { authFeature, AuthState } from './auth.reducer';

export const {
  selectAuthState,
  selectStatus,
  selectError,
  selectIsAuthenticated,
  selectUser,
  selectToken,
} = authFeature;

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.status === 'loading'
);
export const selectAcademicYear = createSelector(
  selectAuthState,
  (state: AuthState) => state.academicYear
);

export const authQuery = {
  selectAuthState,
  selectStatus,
  selectIsLoading,
  selectAcademicYear,
  selectError,
  selectIsAuthenticated,
  selectUser,
  selectToken,
};
