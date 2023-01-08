import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  AdministrationOfficeApiService,
  CityApiService,
  HighSchoolApiService,
  RegionApiService,
} from '@msh/configurations/data-access-configurations';
import {HighSchool} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { HighSchoolFormComponent } from '../high-school-form/high-school-form.component';
import { HighSchoolGridComponent } from '../high-school-grid/high-school-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-high-schools',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    HighSchoolGridComponent,
    HighSchoolFormComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-high-schools.component.html',
  styleUrls: ['./manage-high-schools.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageHighSchoolsComponent implements OnInit {
  private highSchools$$ = new BehaviorSubject<HighSchool[]>([]);
  highSchools$ = this.highSchools$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedHighSchool: HighSchool | null = null;
  selectedHighSchools: HighSchool[] = [];
  displayModal = false;
  cities: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  regions: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly cityApiService: CityApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private readonly regionApiService: RegionApiService
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getCitiesDropdown();
    this.getRegionDropdown();
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

  onGridEvent(event: GridEvent<HighSchool | HighSchool[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedHighSchools = [
          ...this.selectedHighSchools,
          event.data as HighSchool,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedHighSchools = this.selectedHighSchools.filter(hs => {
          hs.id !== (event.data as HighSchool).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedHighSchools = [
          ...this.selectedHighSchools,
          ...(event.data as HighSchool[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedHighSchools = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedHighSchool = Object.assign({}, event.data as HighSchool);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini shkollën e zgjedhur?',
          accept: () => {
            this.deleteHighSchool(event.data as HighSchool);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(highSchool: HighSchool) {
    if (highSchool.id) {
      this.updateHighSchool(highSchool);
    }
    if (!highSchool.id) {
      this.addHighSchool(highSchool);
    }
  }

  getHighSchools($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.highSchoolService
      .loadHighSchools($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchools$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addHighSchool(highSchool: HighSchool) {
    this.highSchoolService
      .save(highSchool)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Shkolla e mesme u shtua me sukses!');
          this.displayModal = false;
          this.getHighSchools(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  updateHighSchool(highSchool: HighSchool) {
    this.highSchoolService
      .update(highSchool)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Shkolla e mesme u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getHighSchools(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteHighSchool(highSchool: HighSchool) {
    this.highSchoolService
      .delete(highSchool.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Shkolla e mesme u fshi me sukses!');
          this.getHighSchools(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së shkollës së mesme!'
          );
      });
  }

  getCitiesDropdown() {
    this.cityApiService.loadDropdownList().subscribe(response => {
      this.cities = response.data;
    });
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
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
