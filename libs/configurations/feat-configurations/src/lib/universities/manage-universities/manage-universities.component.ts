import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  CityApiService,
  RegionApiService,
  UniversityApiService,
} from '@msh/configurations/data-access-configurations';
import { University } from '@msh/configurations/domain-configurations';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { UniversityFormComponent } from '../university-form/university-form.component';
import { UniversityGridComponent } from '../university-grid/university-grid.component';
import { RippleModule } from 'primeng/ripple';
import { DropdownModel } from '@msh/shared/data-access-shared';

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
export class ManageUniversitiesComponent implements OnInit {
  private universities$$ = new BehaviorSubject<University[]>([]);
  universities$ = this.universities$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedRegion: University | null = null;
  selectedUniversities: University[] = [];
  displayModal = false;
  cities: DropdownModel<number>[] = [];
  regions: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly universityService: UniversityApiService,
    private readonly cityApiService: CityApiService,
    private readonly regionApiService: RegionApiService
  ) {}

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

  onGridEvent(event: GridEvent<University | University[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          event.data as University,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedUniversities = this.selectedUniversities.filter(r => {
          r.id !== (event.data as University).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          ...(event.data as University[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedUniversities = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedRegion = Object.assign({}, event.data as University);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rajonin e zgjedhur?',
          accept: () => {
            this.deleteRegion(event.data as University);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(university: University) {
    if (university.id) {
      this.updateRegion(university);
    }
    if (!university.id) {
      this.addRegion(university);
    }
  }

  getUniversities($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.universityService
      .loadUniversities($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.universities$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addRegion(university: University) {
    this.universityService
      .save(university)
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

  updateRegion(university: University) {
    this.universityService
      .update(university)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rajoni u ndryshua me sukses!');
          this.displayModal = false;
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  deleteRegion(university: University) {
    this.universityService
      .delete(university.id)
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

  ngOnInit(): void {
    this.getCitiesDropdown();
    this.getRegionDropdown();
  }

  getCitiesDropdown() {
    this.cityApiService.loadDropdownList().subscribe(response => {
      this.cities = response.data;
    });
  }

  getRegionDropdown() {
    this.regionApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.regions = response.data;
      });
  }
}
