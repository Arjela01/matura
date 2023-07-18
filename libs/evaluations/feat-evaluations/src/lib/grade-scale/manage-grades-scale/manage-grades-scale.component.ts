import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { GradeScaleActionComponent } from '../grade-scale-action/grade-scale-action.component';
import { GradeScaleGridComponent } from '../grade-scale-grid/grade-scale-grid.component';
import { UploadGradeScaleFormComponent } from '../upload-grade-scale-form/upload-grade-scale-form.component';
@Component({
  selector: 'msh-manage-grades-scale',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    GradeScaleActionComponent,
    GradeScaleGridComponent,
    ToolbarModule,
    RippleModule,
    UploadGradeScaleFormComponent,
  ],
  templateUrl: './manage-grades-scale.component.html',
  styleUrls: ['./manage-grades-scale.component.scss'],
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageGradesScaleComponent implements OnInit {
  private gradeScales$$ = new BehaviorSubject<GradesScale[]>([]);
  gradeScales$ = this.gradeScales$$.asObservable();
  filters: LazyLoadEvent | null = null;
  displayGradesModal = false;
  base64: string | ArrayBuffer | null | undefined;
  totalRecords = 0;
  examTypeDropdown: DropdownModel<number>[] = [];
  displayModal = false;
  submitted = false;

  constructor(
    private readonly gradesScaleApiService: GradesScaleService,
    private readonly router: Router,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectsService: ExamSubjectApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly cd: ChangeDetectorRef,
    private authFacade: AuthFacade
  ) {}
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getGradeScales(this.filters as LazyLoadEvent);
      }
    }),
    tap()
  );
  ngOnInit() {
    this.getTypesDropdown();
  }
  onFormSave() {
    this.getGradeScales(this.filters as LazyLoadEvent);
    this.displayModal = false;
  }
  getTypesDropdown() {
    this.examTypeService
      .loadDropdownList()
      .subscribe(res => (this.examTypeDropdown = res.data));
  }

  onNewClick() {
    this.router.navigate(['/evaluations/grades-scale-form']);
  }

  onGridEvent(event: GridEvent<GradesScale>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.router.navigate([
          '/evaluations/grades-scale-form',
          event.data?.id,
        ]);
        break;
    }
  }

  getGradeScales($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.examSubjectsService
      .loadExamSubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.gradeScales$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }

  templateDownload() {
    this.gradesScaleApiService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Nota_Pikë');
      });
  }

  onModalClose() {
    this.displayModal = false;
  }

  openDialog() {
    this.displayModal = true;
  }
}
