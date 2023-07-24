import { ClassProvider } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { StorageService } from './services/storage.service';

export const getLocalStorageProvider = (): ClassProvider => ({
  provide: StorageService,
  useClass: LocalStorageService,
});
