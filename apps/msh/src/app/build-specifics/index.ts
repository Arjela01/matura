import { provideStoreDevtools } from '@ngrx/store-devtools';

export const getStoreDevToolsProvider = () =>
  provideStoreDevtools({
    maxAge: 25,
  });
