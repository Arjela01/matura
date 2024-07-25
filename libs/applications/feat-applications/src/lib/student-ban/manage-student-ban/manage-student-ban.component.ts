import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  ExamTypeApiService,
  StudentBanApiService,
} from '@msh/configurations/data-access-configurations';
import { AcademicYear, ExamDate, StudentBan } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  tap,
} from 'rxjs';
import { StudentBanFormComponent } from '../student-ban-form/student-ban-form.component';
import { StudentBanGridComponent } from '../student-ban-grid/student-ban-grid.component';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { CustomSwitchComponent } from '@msh/shared/ui-shared';

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
    CustomSwitchComponent,
  ],
  templateUrl: './manage-student-ban.component.html',
  styleUrls: ['./manage-student-ban.component.scss'],
  providers: [ConfirmationService],
})
export class ManageStudentBanComponent implements OnInit {
  private bannedStudents$$ = new BehaviorSubject<StudentBan[]>([]);
  bannedStudents$ = this.bannedStudents$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedBannedStudent: StudentBan | null = null;
  examTypes: DropdownModel<number>[] = [];
  displayModal = false;
  currentAcademicYear?: Partial<AcademicYear>;
  isOn = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studentBannedService: StudentBanApiService,
    private cd: ChangeDetectorRef,
    private readonly examTypeService: ExamTypeApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.getBannedStudents(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit() {
    this.getExamTypes();
    this.academicYear$.pipe(untilDestroyed(this)).subscribe();
  }

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getBannedStudents(this.filters as TableLazyLoadEvent);
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedBannedStudent = {
      isFall: this.currentAcademicYear?.isFall ?? false,
    } as StudentBan;
  }

  onModalClose() {
    this.displayModal = false;
  }

  onGridEvent(event: GridEvent<StudentBan | StudentBan[]>) {
    switch (event.action) {
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
            'Jeni i sigurt që doni të fshini maturantin e skualifikuar të zgjedhur?',
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

    if (this.isOn && this.currentAcademicYear?.isFall) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.currentAcademicYear.isFall,
          matchMode: 'equals',
        },
      };
    } else {
      this.filters.filters = {};
    }

    this.studentBannedService
      .loadBannedStudents(this.filters)
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
          this.toastService.showSuccess('Maturanti u shtua me sukses!');
          this.displayModal = false;
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të maturantit!'
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
          this.toastService.showSuccess('Skualifikimi u ruajt me sukses!');
          this.displayModal = false;
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ruajtjes së skualifikimit!'
          );
      });
  }

  deleteBannedStudent(studentBan: StudentBan) {
    this.studentBannedService
      .delete(studentBan.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Maturant u fshi me sukses!');
          this.getBannedStudents(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të maturantit!'
          );
      });
  }

  getExamTypes() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examTypes = res.data));
  }

  clearSelectedStudent() {
    this.selectedBannedStudent = {
      ...this.selectedBannedStudent,
      studentInputData: '',
      studentStudentId: '',
      studentFirstName: '',
      studentLastName: '',
      studentMiddleName: '',
      studentId: '',
    } as StudentBan;
    this.cd.detectChanges();
  }
}
