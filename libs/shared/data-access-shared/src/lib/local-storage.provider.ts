import { ValueProvider } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { StorageService } from './services/storage.service';

export const getLocalStorageProvider = (): ValueProvider => ({
  provide: StorageService,
  useValue: LocalStorageService,
});
