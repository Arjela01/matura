import { createSelector } from '@ngrx/store';
import { authFeature, AuthState } from './auth.reducer';

export const {
  selectAuthState,
  selectStatus,
  selectError,
  selectIsAuthenticated,
  selectUser,
} = authFeature;

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.status === 'loading'
);

export const authQuery = {
  selectAuthState,
  selectStatus,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectUser,
};
