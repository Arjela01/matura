import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {
  AdministrationOfficeApiService,
  CityApiService, ExamAssignmentApiService,
} from '@msh/configurations/data-access-configurations';
import {AdministrationOffice, ExamAssignment} from '@msh/shared/domain-models';
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
import {RippleModule} from "primeng/ripple";
import {
  DiplomaRequirementExemptionGridComponent
} from "../diploma-requirement-exemption-grid/diploma-requirement-exemption-grid.component";
import {
  DiplomaRequirementExemptionFormComponent
} from "../diploma-requirement-exemption-form/diploma-requirement-exemption-form.component";

@UntilDestroy()
@Component({
  selector: 'msh-manage-diploma-requirement-exemption',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    DiplomaRequirementExemptionGridComponent,
    DiplomaRequirementExemptionFormComponent,
  ],
  templateUrl: './manage-diploma-requirement-exemption.component.html',
  styleUrls: ['./manage-diploma-requirement-exemption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDiplomaRequirementExemptionComponent implements OnInit {
  private examAssignments$$ = new BehaviorSubject<ExamAssignment[]>([]);

  private administrativeOffices$$ = new BehaviorSubject<AdministrationOffice[]>(
    []
  );
  administrativeOffices$ = this.administrativeOffices$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedAdministrativeOffice: AdministrationOffice | null = null;
  selectedAdministrativeOffices: AdministrationOffice[] = [];
  displayUploadModal = false;
  selectedExamAssignment: ExamAssignment | null = null;
  selectedExamAssignments: ExamAssignment[] = [];
  displayModal = false;
  cities: DropdownModel<number>[] = [];
  dars: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityApiService: CityApiService,
    private readonly adminOfficeApiService: AdministrationOfficeApiService,
    private readonly examAssignmentService: ExamAssignmentApiService,

  ) {}

  ngOnInit(): void {
    this.getCitiesDropdown();
    this.getAdministrationOfficeDropdown();
  }
  onUploadClick() {
    this.displayUploadModal = true;
  }

  onUploadClose() {
    this.displayUploadModal = false;
  }


  onUploadFormSave() {
    this.getExamAssignments(this.filters as LazyLoadEvent);
  }
  getExamAssignments($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examAssignmentService
      .loadExamAssignments($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examAssignments$$.next(response.data);
        this.totalRecords = response.total;
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
          message: 'Jeni i sigurt qe doni te ndryshoni statusin e perdoruesit?',
          accept: () => {
            this.changeStatus(event.data as AdministrationOffice);
          },
        });
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

  changeStatus(administrationOffice: AdministrationOffice) {
    this.adminOfficeApiService
      .changeStatus({
        "id": administrationOffice.id,
        "isAllowedToLogin": !administrationOffice.isAllowedToLogin
      })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            response.data.isAllowedToLogin
              ? 'Perdoruesi u çaktivizua me sukses!'
              : 'Perdoruesi u aktivizua me sukses!'
          );
          this.displayModal = false;
          this.getAdministrationOffices(this.filters as LazyLoadEvent);
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
    this.adminOfficeApiService
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
    this.adminOfficeApiService
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
    this.adminOfficeApiService
      .loadOnlyDars()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dars = response.data;
      });
  }
}
