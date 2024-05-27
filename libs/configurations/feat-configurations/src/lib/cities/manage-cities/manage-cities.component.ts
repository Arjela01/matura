import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { CityApiService } from '@msh/configurations/data-access-configurations';
import { RegionApiService } from '@msh/configurations/data-access-configurations';
import { City } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { CityFormComponent } from '../city-form/city-form.component';
import { CityGridComponent } from '../city-grid/city-grid.component';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-cities',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    CityGridComponent,
    CityFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-cities.component.html',
  styleUrls: ['./manage-cities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageCitiesComponent implements OnInit {
  private cities$$ = new BehaviorSubject<City[]>([]);
  cities$ = this.cities$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedCity: City | null = null;
  selectedCities: City[] = [];
  displayModal = false;

  regions: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityService: CityApiService,
    private readonly regionApiService: RegionApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getCities(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit(): void {
    this.getRegionDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedCity = {} as City;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini qytetet e zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Qytetet u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<City | City[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedCities = [...this.selectedCities, event.data as City];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedCities = this.selectedCities.filter(c => {
          c.id !== (event.data as City).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedCities = [
          ...this.selectedCities,
          ...(event.data as City[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedCities = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedCity = Object.assign({}, event.data as City);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini qytetin e zgjedhur?',
          accept: () => {
            this.deleteCity(event.data as City);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(city: City) {
    if (city.id) {
      this.updateCity(city);
    }
    if (!city.id) {
      this.addCity(city);
    }
  }

  getCities($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.cityService
      .loadCities($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.cities$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addCity(city: City) {
    this.cityService
      .save(city)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Qyteti u shtua me sukses!');
          this.displayModal = false;
          this.getCities(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të qytetit!'
          );
      });
  }

  updateCity(city: City) {
    this.cityService
      .update(city)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Qyteti u ndryshua me sukses!');
          this.displayModal = false;
          this.getCities(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të qytetit!'
          );
      });
  }

  deleteCity(city: City) {
    this.cityService
      .delete(city.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Qyteti u fshi me sukses!');
          this.getCities(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të qytetit!'
          );
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
