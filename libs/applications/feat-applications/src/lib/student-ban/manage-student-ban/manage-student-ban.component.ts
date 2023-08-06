import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { StudentBanApiService } from '@msh/configurations/data-access-configurations';
import { StudentBan } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { StudentBanFormComponent } from '../student-ban-form/student-ban-form.component';
import { StudentBanGridComponent } from '../student-ban-grid/student-ban-grid.component';
import { RippleModule } from 'primeng/ripple';
import {TableLazyLoadEvent} from "primeng/table";

@UntilDestroy()
@Component({
  selector: 'msh-manage-student-ban',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    StudentBanFormComponent,
    StudentBanGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-student-ban.component.html',
  styleUrls: ['./manage-student-ban.component.scss'],
  providers: [ConfirmationService],
})
export class ManageStudentBanComponent {
  private bannedStudents$$ = new BehaviorSubject<StudentBan[]>([]);
  bannedStudents$ = this.bannedStudents$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedBannedStudent: StudentBan | null = null;
  selectedBannedStudents: StudentBan[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studentBannedService: StudentBanApiService,
    private cd: ChangeDetectorRef
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedBannedStudent = {} as StudentBan;
  }

  onModalClose() {
    this.displayModal = false;
  }

  onGridEvent(event: GridEvent<StudentBan | StudentBan[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedBannedStudents = [
          ...this.selectedBannedStudents,
          event.data as StudentBan,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedBannedStudents = this.selectedBannedStudents.filter(sb => {
          sb.id !== (event.data as StudentBan).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedBannedStudents = [
          ...this.selectedBannedStudents,
          ...(event.data as StudentBan[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedBannedStudents = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedBannedStudent = Object.assign(
          {},
          event.data as StudentBan
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini studentin e skualifikuar të zgjedhur?',
          accept: () => {
            this.deleteBannedStudent(event.data as StudentBan);
          },
        });
        break;
    }
  }
  onFormSave(studentBan: StudentBan) {
    if (studentBan.id) {
      this.updateBannedStudent(studentBan);
    }
    if (!studentBan.id) {
      this.addBannedStudent(studentBan);
    }
  }

  getBannedStudents($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studentBannedService
      .loadBannedStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.bannedStudents$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  addBannedStudent(studentBan: StudentBan) {
    this.studentBannedService
      .save(studentBan)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u shtua me sukses!');
          this.displayModal = false;
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
        this.cd.markForCheck();
      });
  }

  updateBannedStudent(studentBan: StudentBan) {
    this.studentBannedService
      .update(studentBan)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
        this.displayModal = false;
      });
  }

  deleteBannedStudent(studentBan: StudentBan) {
    this.studentBannedService
      .delete(studentBan.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Studenti u fshi me sukses!');
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të studentit!'
          );
      });
  }
}
