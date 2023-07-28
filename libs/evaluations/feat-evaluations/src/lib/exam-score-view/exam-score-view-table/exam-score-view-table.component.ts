import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ExamScore, ExamScores } from '@msh/evaluations/domain-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-view-table',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule, PaginatorModule],
  templateUrl: './exam-score-view-table.component.html',
  styleUrls: ['./exam-score-view-table.component.scss'],
})
export class ExamScoreViewTableComponent implements OnInit {
  @Input() examScoreLists: ExamScores[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() changePage = new EventEmitter();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamScores | ExamScores[]>
  >();

  @Output() lazyLoadData = new EventEmitter<any>();
  currentPage = 1;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  pageSize = 100;
  constructor(
    private cdr: ChangeDetectorRef,
    private readonly examScoreService: ExamScoreApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.loadRows();
  }

  saveExamScore(examScore: any) {
    this.examScoreService
      .save(examScore)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(2222, examScore);
        if (response.isSuccessful) {
          this.toastService.showSuccess('Piket Totale u shtuan me sukses!');
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të pikeve!'
          );
        }
      });
  }

  saveWritingScoreChanges(rowData: any) {
    const examScore: ExamScores = {
      ...rowData,
      writingScore: rowData.writingScore,
    };
    this.saveExamScore(examScore);
  }

  loadRows() {
    this.lazyLoadData.emit(this.event);
  }
}
