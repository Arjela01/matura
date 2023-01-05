import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { MenuApiService } from './menu-api.service';
import {MenuNode} from "../../../../domain-layout/src";
import {GenericStoreStatus} from "@msh/shared/data-access-shared";

export interface MenuState {
  menus: MenuNode[];
  status: GenericStoreStatus;
  error: string | null;

}

const initialMenuState: MenuState = {
  menus: [],
  status: "initial",
  error: null,
};

@Injectable()
export class MenuStore extends ComponentStore<MenuState> {
  constructor(private menuApiService: MenuApiService) {
    super(initialMenuState);
  }

  //Effects
  loadMenus = this.effect<void>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(() => {
        return this.menuApiService.loadDummyMenus().pipe(
          tapResponse(
            (menus: MenuNode[]) => {
              this.patchState({
                status: 'success',
                menus,
              });
            },
            error => {
              this.patchState({
                status: 'error',
                error: error as string,
              });
            }
          )
        );
      })
    )
  );

  //Selectors
  readonly menus$ = this.select(state => state.menus);
}
