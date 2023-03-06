import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GendersApiService } from '@msh/configurations/data-access-configurations';
import { Gender } from '@msh/shared/domain-models';
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
import { GenderFormComponent } from '../gender-form/gender-form.component';
import { GenderGridComponent } from '../gender-grid/gender-grid.component';
import {RippleModule} from "primeng/ripple";

@Component({
  selector: 'msh-manage-genders',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    GenderFormComponent,
    GenderGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-genders.component.html',
  styleUrls: ['./manage-genders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageGendersComponent {
  private genders$$ = new BehaviorSubject<Gender[]>([]);
  genders$ = this.genders$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedGender: Gender | null = null;
  selectedGenders: Gender[] = [];
  displayModal = false;

  cities: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  regions: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly genderService: GendersApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedGender = {} as Gender;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini gjinitë e zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('Gjinia u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<Gender | Gender[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedGenders = [...this.selectedGenders, event.data as Gender];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedGenders = this.selectedGenders.filter(hs => {
          hs.id !== (event.data as Gender).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedGenders = [
          ...this.selectedGenders,
          ...(event.data as Gender[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedGenders = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedGender = Object.assign({}, event.data as Gender);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini gjininë e zgjedhur?',
          accept: () => {
            this.deleteGender(event.data as Gender);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedGender=null
  }

  onFormSave(gender: Gender) {
    if (gender.id) {
      this.updateGender(gender);
    }
    if (!gender.id) {
      this.addGender(gender);
    }
  }

  getGenders($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.genderService
      .loadGenders($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.genders$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addGender(gender: Gender) {
    this.genderService
      .save(gender)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Gjinia u shtua me sukses!');
          this.displayModal = false;
          this.getGenders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së gjinisë!'
          );
      });
  }

  updateGender(gender: Gender) {
    this.genderService
      .update(gender)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Gjinia u ndryshua me sukses!');
          this.displayModal = false;
          this.getGenders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të gjinisë!'
          );
      });
  }

  deleteGender(gender: Gender) {
    this.genderService
      .delete(gender.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Gjinia u fshi me sukses!');
          this.getGenders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së gjinisë!'
          );
      });
  }
}
