import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamSubjectApiService,
  ExamSubjectGroupApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamSubjectGroup } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ExamSubjectGroupFormComponent } from '../exam-subject-group-form/exam-subject-group-form.component';
import { ExamSubjectGroupGridComponent } from '../exam-subject-group-grid/exam-subject-group-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-subject-group',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSubjectGroupFormComponent,
    ExamSubjectGroupGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-subject-group.component.html',
  styleUrls: ['./manage-exam-subject-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSubjectGroupComponent implements OnInit {
  private examSubjectGroup$$ = new BehaviorSubject<ExamSubjectGroup[]>([]);
  examSubjectGroup$ = this.examSubjectGroup$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSubjectGroup: ExamSubjectGroup | null = null;
  displayModal = false;

  examSubjects: DropdownModel<string>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectGroupService: ExamSubjectGroupApiService,
    private readonly examSubjectsService: ExamSubjectApiService,
    private authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamSubjectGroups(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit(): void {
    this.getExamTypesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSubjectGroup = {} as ExamSubjectGroup;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini lëndët provimeve të zgjedhura?',
      accept: () => {
        this.toastService.showWarning('');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamSubjectGroup | ExamSubjectGroup[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedExamSubjectGroup = Object.assign(
          {},
          event.data as ExamSubjectGroup
        );
        console.log(123, this.selectedExamSubjectGroup);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini grupin e zgjedhur?',
          accept: () => {
            this.deleteExamSubjectGroup(event.data as ExamSubjectGroup);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examSubjectGroup: ExamSubjectGroup) {
    if (examSubjectGroup.id) {
      this.updateExamSubjectGroup(examSubjectGroup);
    }
    if (!examSubjectGroup.id) {
      this.addExamSubjectGroup(examSubjectGroup);
    }
  }

  getExamSubjectGroups($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.examSubjectGroupService
      .loadExamSubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const flattenedData = this.flattenExamSubjectGroups(response.data);
        this.examSubjectGroup$$.next(flattenedData);
        this.totalRecords = response.total;
      });
  }

  flattenExamSubjectGroups(groups: ExamSubjectGroup[]): any[] {
    return groups.map(group => ({
      id: group.id,
      name: group.name,
      examSubjects: group.examSubjects
        ? group.examSubjects.map(subject => subject.name).join(', ')
        : '',
      examSubjectIds: group.examSubjects
        ? group.examSubjects.map(subject => subject.id)
        : '',
    }));
  }

  addExamSubjectGroup(examSubjectGroup: ExamSubjectGroup) {
    this.examSubjectGroupService
      .save(examSubjectGroup)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Grupi i lëndëve të provimit u shtua me sukses!'
          );
          this.displayModal = false;
          this.getExamSubjectGroups(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të grupit të zgjedhur!'
          );
      });
  }

  updateExamSubjectGroup(examSubjectGroup: ExamSubjectGroup) {
    this.examSubjectGroupService
      .update(examSubjectGroup)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Grupi i lëndëve të u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamSubjectGroups(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të grupit të zgjedhur!'
          );
      });
  }

  deleteExamSubjectGroup(examSubjectGroup: ExamSubjectGroup) {
    this.examSubjectGroupService
      .delete(examSubjectGroup.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Grupi i lëndës së provimit u fshi me sukses!'
          );
          this.getExamSubjectGroups(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së grupit!'
          );
      });
  }
  getExamTypesDropdown() {
    this.examSubjectsService.loadDropdownList().subscribe(response => {
      this.examSubjects = response.data;
    });
  }
}
