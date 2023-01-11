import { APP_INITIALIZER } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';

function loadAuthFactory(authFacade: AuthFacade) {
  return () => authFacade.init();
}

export const loadAuthProvider = () => ({
  provide: APP_INITIALIZER,
  useFactory: loadAuthFactory,
  deps: [AuthFacade],
  multi: true,
});
