import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  UniversityApiService
} from '@msh/configurations/data-access-configurations';
import { Region } from '@msh/configurations/domain-configurations';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { UniversityFormComponent } from '../university-form/university-form.component';
import { UniversityGridComponent } from '../university-grid/university-grid.component';
import {RippleModule} from "primeng/ripple";

@UntilDestroy()
@Component({
  selector: 'msh-manage-universities',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    UniversityGridComponent,
    UniversityFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-universities.component.html',
  styleUrls: ['./manage-universities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageUniversitiesComponent {
  private regions$$ = new BehaviorSubject<Region[]>([]);
  regions$ = this.regions$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedRegion: Region | null = null;
  selectedUniversities: Region[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly universityService: UniversityApiService
  ) {
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini rajonet e zgjedhura?',
      accept: () => {
        //this.regionStore.deleteSelectedUniversities();
        this.toastService.showWarning('Rajonet u fshin!');
      },
    });
  }

  onGridEvent(event: GridEvent<Region | Region[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          event.data as Region,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedUniversities = this.selectedUniversities.filter(r => {
          r.id !== (event.data as Region).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          ...(event.data as Region[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedUniversities = [];
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

  getUniversities($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.universityService
      .loadUniversities($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.regions$$.next(response.data);
        this.totalRecords = response.total;
      });

  }

  addRegion(region: Region) {
    this.universityService
      .save(region)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rajoni u shtua me sukses!');
          this.displayModal = false;
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  updateRegion(region: Region) {
    this.universityService
      .update(region)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Rajoni u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  deleteRegion(region: Region) {
    this.universityService
      .delete(region.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rajoni u fshi me sukses!');
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së rajonit!'
          );
      });
  }
}
