import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AnnualGradesApiService,
  ExamGradeApiService,
} from '@msh/evaluations/data-access-evaluations';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { ExamGrade, Student } from '@msh/shared/domain-models';
import { ColumnFilterDirective, GridEvent } from '@msh/shared/util-shared';
import * as FileSaver from 'file-saver';
import {AppDatePipe} from "@msh/shared/ui-shared";

@UntilDestroy()
@Component({
  selector: 'msh-annual-grades-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
    AppDatePipe,
  ],
  templateUrl: './annual-grades-grid.component.html',
  styleUrls: ['./annual-grades-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnualGradesGridComponent {
  private annualGrade$$ = new BehaviorSubject<ExamGrade[]>([]);
  private student$$ = new BehaviorSubject<Student[]>([]);
  id: any;
  student$ = this.student$$.asObservable();
  @Output() gridEvent = new EventEmitter<GridEvent<ExamGrade | Student[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  @Output() formSave = new EventEmitter<ExamGrade[] | Student[]>();
  annualGrade$ = this.annualGrade$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly examGradeApiService: ExamGradeApiService,
    private readonly studentApiService: StudentsApiService,
    private route: ActivatedRoute,
    private readonly annualGradeService: AnnualGradesApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  getStudent($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studentApiService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.student$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  exportFile() {
    this.annualGradeService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Lista e aplikimeve IAL');
      });
  }
}
