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
import {
  ExamScore,
  ExamScoreDataEntry,
  ExamScores,
} from '@msh/evaluations/domain-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-view-table',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule, PaginatorModule],
  templateUrl: './exam-score-view-table.component.html',
  styleUrls: ['./exam-score-view-table.component.scss'],
})
export class ExamScoreViewTableComponent implements OnInit {
  @Input() examScoreLists: ExamScoreDataEntry[] = [];
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
  deleteExamScore(examScore: any) {
    console.log(123, examScore);
    this.examScoreService
      .delete(examScore.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          //this.getExamScores(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
      });
  }

  saveWritingScoreChanges(rowData: any) {
    const examScore: ExamScores = {
      archiveFolderId: rowData.archiveExam.archiveFolderId,
      archiveFolderNr: rowData.archiveExam.archiveFolderNr,
      examSubjectId: rowData.examScore.examSubjectId,
      barcode: rowData.archiveExam.barcode,
      examTypeId: rowData.examScore.examTypeId,
      writingScore: rowData.examScore.writingScore,
    };
    this.saveExamScore(examScore);
  }

  loadRows() {
    this.lazyLoadData.emit(this.event);
  }
}
