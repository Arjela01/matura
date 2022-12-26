import { ValueProvider } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.service';

export const getLocalStorageProvider = (): ValueProvider => ({
  provide: StorageService,
  useValue: LocalStorageService,
});
