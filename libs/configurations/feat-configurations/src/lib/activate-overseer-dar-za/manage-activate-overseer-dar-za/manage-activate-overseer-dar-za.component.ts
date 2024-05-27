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
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { ActivateOverseerDarZaGridComponent } from '../activate-overseer-dar-za-grid/activate-overseer-dar-za-grid.component';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-activate-overseer-dar-za',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    ActivateOverseerDarZaGridComponent,
  ],
  templateUrl: './manage-activate-overseer-dar-za.component.html',
  styleUrls: ['./manage-activate-overseer-dar-za.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageActivateOverseerDarZaComponent implements OnInit {
  private administrativeOffices$$ = new BehaviorSubject<AdministrationOffice[]>(
    []
  );
  administrativeOffices$ = this.administrativeOffices$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

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
    private readonly adminOfficeApiService: AdministrationOfficeApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getAdministrationOffices(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

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
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të ndryshoni statusin e përdoruesve?',
          accept: () => {
            this.changeStatus(event.data as AdministrationOffice);
          },
        });
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

  changeStatus(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .changeStatus({
        id: administrationOffice.id,
        isAllowedToLogin: !administrationOffice.isAllowedToLogin,
      })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            administrationOffice?.isAllowedToLogin
              ? 'Çaktivizimi i përdoruesve u krye me sukses për këtë ZVAP!'
              : 'Aktivizimi i përdoruesve u krye me sukses për këtë ZVAP!'
          );
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së statusit!'
          );
      });
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

  getAdministrationOffices($event: TableLazyLoadEvent) {
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
          this.toastService.showSuccess('DAR/ZA u shtua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së DAR/ZA!'
          );
      });
  }

  updateAdministrationOffice(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .update(administrationOffice)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('DAR/ZA u ndryshua me sukses!');
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as TableLazyLoadEvent);
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
          this.toastService.showInfo('DAR/ZA u fshi me sukses!');
          this.getAdministrationOffices(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes DAR/ZA!'
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
