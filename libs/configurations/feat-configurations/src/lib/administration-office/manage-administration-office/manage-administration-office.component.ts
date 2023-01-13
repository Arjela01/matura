import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AdministrationOffice } from '@msh/configurations/domain-configurations';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import {
  AdministrationOfficeApiService,
  CityApiService,
} from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogModule } from 'primeng/dialog';
import { AdministrationOfficeFormComponent } from '../administration-office-form/administration-office-form.component';
import { AdministrationOfficeGridComponent } from '../administration-office-grid/administration-office-grid.component';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'msh-manage-administration-office',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    AdministrationOfficeFormComponent,
    AdministrationOfficeGridComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-administration-office.component.html',
  styleUrls: ['./manage-administration-office.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageAdministrationOfficeComponent {
  private administrativeOffices$$ = new BehaviorSubject<AdministrationOffice[]>(
    []
  );
  administrativeOffices$ = this.administrativeOffices$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedAdministrativeOffice: AdministrationOffice | null = null;
  selectedAdministrativeOffices: AdministrationOffice[] = [];
  displayModal = false;

  cities: DropdownModel<number>[] = [];
  dars: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityApiService: CityApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService
  ) {}

  ngOnInit(): void {
    this.getCitiesDropdown();
    this.getAdministrationOfficeDropdown();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini DAR/ZA?',
      accept: () => {
        this.toastService.showWarning('DAR/ZA u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<AdministrationOffice | AdministrationOffice[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedAdministrativeOffices = [
          ...this.selectedAdministrativeOffices,
          event.data as AdministrationOffice,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedAdministrativeOffices =
          this.selectedAdministrativeOffices.filter(hs => {
            hs.id !== (event.data as AdministrationOffice).id;
          });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedAdministrativeOffices = [
          ...this.selectedAdministrativeOffices,
          ...(event.data as AdministrationOffice[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedAdministrativeOffices = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedAdministrativeOffice = Object.assign(
          {},
          event.data as AdministrationOffice
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini DAR/ZA?',
          accept: () => {
            this.deleteAdministrationOffices(
              event.data as AdministrationOffice
            );
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedAdministrativeOffice = null;
  }

  onFormSave(administrationOffices: AdministrationOffice) {
    if (administrationOffices.id) {
      this.updateAdministrationOffice(administrationOffices);
    }
    if (!administrationOffices.id) {
      this.addAdministrationOffice(administrationOffices);
    }
  }

  getAdministrationOffices($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.administrationOfficeApiService
      .loadAdministrationOffices($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrativeOffices$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addAdministrationOffice(administrationOffice: AdministrationOffice) {
    this.administrationOfficeApiService
      .save(administrationOffice)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('DAR/ZA u shtua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së DAR/ZA!'
          );
      });
  }

  updateAdministrationOffice(administrationOffice: AdministrationOffice) {
    this.administrationOfficeApiService
      .update(administrationOffice)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('DAR/ZA u ndryshua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteAdministrationOffices(administrationOffice: AdministrationOffice) {
    this.administrationOfficeApiService
      .delete(administrationOffice.id as number)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('DAR/ZA u fshi me sukses!');
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes DAR/ZA!'
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
      .loadOnlyDars()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dars = response.data;
      });
  }
}
