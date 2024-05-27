import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamType } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ExamTypeGridComponent } from '../exam-type-grid/exam-type-grid.component';
import { ExamTypeFormComponent } from '../exam-type-form/exam-type-form.component';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamTypeApiService } from '@msh/configurations/data-access-configurations';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-type',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    ExamTypeGridComponent,
    ExamTypeFormComponent,
    RippleModule,
  ],
  templateUrl: './manage-exam-type.component.html',
  styleUrls: ['./manage-exam-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamTypeComponent {
  private examTypes$$ = new BehaviorSubject<ExamType[]>([]);
  examTypes$ = this.examTypes$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamTypes: ExamType[] = [];
  selectedExamType: ExamType | null = null;

  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamTypes(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.displayModal = true;
    this.selectedExamType = {} as ExamType;
  }

  onGridEvent(event: GridEvent<ExamType | ExamType[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamTypes = [
          ...this.selectedExamTypes,
          event.data as ExamType,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamTypes = this.selectedExamTypes.filter(et => {
          et.id !== (event.data as ExamType).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamTypes = [
          ...this.selectedExamTypes,
          ...(event.data as ExamType[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamTypes = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamType = Object.assign({}, event.data as ExamType);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini tipin e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamType(event.data as ExamType);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examType: ExamType) {
    if (examType.id) {
      this.updateExamType(examType);
    }
    if (!examType.id) {
      this.addExamType(examType);
    }
  }

  getExamTypes($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examTypeService
      .loadExamTypes($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamType(examType: ExamType) {
    this.examTypeService
      .save(examType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Tipi i provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamTypes(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së tipit të provimit!'
          );
      });
  }

  updateExamType(examType: ExamType) {
    this.examTypeService
      .update(examType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Tipi i provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamTypes(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së tipit të provimit!'
          );
      });
  }

  deleteExamType(examType: ExamType) {
    this.examTypeService
      .delete(examType.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Tipi i provimit u fshi me sukses!');
          this.getExamTypes(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së tipit të provimit!'
          );
      });
  }
}
