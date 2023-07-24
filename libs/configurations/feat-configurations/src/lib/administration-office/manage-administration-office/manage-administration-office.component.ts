import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AdministrationOfficeApiService,
  CityApiService,
} from '@msh/configurations/data-access-configurations';
import { AdministrationOffice } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { AdministrationOfficeFormComponent } from '../administration-office-form/administration-office-form.component';
import { AdministrationOfficeGridComponent } from '../administration-office-grid/administration-office-grid.component';
import { RippleModule } from 'primeng/ripple';

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
    RippleModule,
  ],
  templateUrl: './manage-administration-office.component.html',
  styleUrls: ['./manage-administration-office.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageAdministrationOfficeComponent implements OnInit {
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
    private readonly adminOfficeApiService: AdministrationOfficeApiService
  ) {}

  ngOnInit(): void {
    this.getCitiesDropdown();
    this.getAdministrationOfficeDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedAdministrativeOffice = {} as AdministrationOffice;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini ZVAP?',
      accept: () => {
        this.toastService.showWarning('ZVAP u fshi!');
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
          message: 'Jeni i sigurt që doni të fshini ZVAP?',
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

    this.adminOfficeApiService
      .loadAdministrationOffices($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrativeOffices$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addAdministrationOffice(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .save(administrationOffice)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('ZVAP u shtua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së ZVAP!'
          );
      });
  }

  updateAdministrationOffice(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .update(administrationOffice)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('ZVAP u ndryshua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteAdministrationOffices(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .delete(administrationOffice.id as number)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('ZVAP u fshi me sukses!');
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes ZVAP!'
          );
      });
  }

  getCitiesDropdown() {
    this.cityApiService.loadDropdownList().subscribe(response => {
      this.cities = response.data;
    });
  }
  getAdministrationOfficeDropdown() {
    this.adminOfficeApiService
      .loadOnlyDars()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dars = response.data;
      });
  }
}
