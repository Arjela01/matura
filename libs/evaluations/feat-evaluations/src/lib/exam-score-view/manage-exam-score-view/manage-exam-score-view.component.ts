import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
  ExamScoreApiService,
} from '@msh/evaluations/data-access-evaluations';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  ExamScore,
  ExamScoreDataEntry,
  ExamScores,
} from '@msh/evaluations/domain-evaluations';
import { DropdownModule } from 'primeng/dropdown';
import { ExamScoreViewFiltersComponent } from '../exam-score-view-filters/exam-score-view-filters.component';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamScoreViewTableComponent } from '../exam-score-view-table/exam-score-view-table.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-score-view',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ExamScoreViewFiltersComponent,
    ExamScoreViewTableComponent,
  ],
  templateUrl: './manage-exam-score-view.component.html',
  styleUrls: ['./manage-exam-score-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageExamScoreViewComponent implements OnInit {
  private examScoreList$$ = new BehaviorSubject<ExamScoreDataEntry[]>([]);
  examScoreList$ = this.examScoreList$$.asObservable();
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;
  archiveFolder: DropdownModel<number>[] = [];
  selectedExamScoreList: ExamScores | null | undefined;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly archiveExamService: ArchiveExamApiService,
    private readonly examScoreService: ExamScoreApiService,
    private readonly archiveFolderService: ArchiveFolderApiService
  ) {}

  ngOnInit() {
    //this.getExamScores(this.event);
    this.getArchiveFolders();
  }

  getArchiveFolders() {
    this.archiveFolderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolder = response.data;
      });
  }
  // getExamScores($event: LazyLoadEvent) {
  //   this.filters = Object.assign({}, $event);
  //
  //   this.examScoreService
  //     .loadExamScores($event)
  //     .pipe(untilDestroyed(this))
  //     .subscribe(response => {
  //       this.examScoreList$$.next(response.data);
  //       this.totalRecords = response.total;
  //     });
  // }

  getExamScoresListById($event: any) {
    this.filters = Object.assign({}, $event);
    this.event.filters = {
      archiveFolderId: [
        {
          value: $event.archiveFolderId,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
      hasWritingScore: [
        {
          value: $event.hasWritingScore,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
    };
    forkJoin([
      this.archiveExamService.getExamsByFolderId($event.archiveFolderId),
      this.examScoreService.loadExamScores(this.event),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([archiveExams, examScores]) => {
        examScores.data.map(
          (item: { hasWritingScore: boolean }) => (item.hasWritingScore = true)
        );
        const result = archiveExams.data.map(
          (archiveExam: { barcode: string; examSubjectId: string }) => {
            return {
              archiveExam: archiveExam,
              examScore:
                examScores.data.find(
                  (examScore: { barcode: string; examSubjectId: string }) =>
                    examScore.barcode == archiveExam.barcode
                ) ?? ({} as ExamScore),
            } as unknown as ExamScoreDataEntry;
          }
        );
        this.examScoreList$$.next(result);
        console.log(123, result);
      });
  }
}
