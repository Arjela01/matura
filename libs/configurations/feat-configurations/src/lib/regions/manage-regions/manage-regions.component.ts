import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  RegionsApiService,
} from '@msh/configurations/data-access-configurations';
import { Region } from '@msh/configurations/domain-configurations';


import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { RegionFormComponent } from '../region-form/region-form.component';
import { RegionGridComponent } from '../region-grid/region-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-regions',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    RegionGridComponent,
    RegionFormComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-regions.component.html',
  styleUrls: ['./manage-regions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageRegionsComponent {
  private regions$$ = new BehaviorSubject<Region[]>([]);
  regions$ = this.regions$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedRegion: Region | null = null;
  selectedRegions: Region[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly regionService: RegionsApiService
  ) {
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini shkollat e zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('High Schools deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<Region | Region[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedRegions = [
          ...this.selectedRegions,
          event.data as Region,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedRegions = this.selectedRegions.filter(r => {
          r.id !== (event.data as Region).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedRegions = [
          ...this.selectedRegions,
          ...(event.data as Region[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedRegions = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedRegion = Object.assign({}, event.data as Region);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rajonin e zgjedhur?',
          accept: () => {
            this.deleteRegion(event.data as Region);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(region: Region) {
    if (region.id) {
      this.updateRegion(region);
    }
    if (!region.id) {
      this.addRegion(region);
    }
  }

  getRegions($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.regionService
      .loadRegions($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.regions$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addRegion(region: Region) {
    this.regionService
      .save(region)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rajoni u shtua me sukses!');
          this.displayModal = false;
          this.getRegions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  updateRegion(region: Region) {
    this.regionService
      .update(region)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Rajoni u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getRegions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  deleteRegion(region: Region) {
    this.regionService
      .delete(region.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rajoni u fshi me sukses!');
          this.getRegions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së rajonit!'
          );
      });
  }

}
