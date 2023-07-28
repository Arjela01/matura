import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  ArchiveExamApiService,
  ExamScoreApiService,
} from '@msh/evaluations/data-access-evaluations';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';
import { ExamScores } from '@msh/evaluations/domain-evaluations';
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
export class ManageExamScoreViewComponent {
  private examScoreList$$ = new BehaviorSubject<any[]>([]);
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
    private readonly examScoreService: ExamScoreApiService
  ) {}

  onFormSave(event: any) {
    this.selectedExamScoreList = event;
    this.search();
  }

  getExamScoresList($event: any) {
    this.filters = Object.assign({}, $event);
    this.examScoreService
      .loadExamScores(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examScoreList$$.next(response.data);
        this.totalRecords = response.data.length;
        response.data.map(
          (item: { hasWritingScore: boolean }) => (item.hasWritingScore = true)
        );
        console.log(2222, response.data);
      });
  }
  getExamScoresListById($event: any) {
    this.filters = Object.assign({}, $event);
    const archiveFolder$ = this.archiveExamService.getExamsByFolderId(
      this.selectedExamScoreList?.archiveFolderId
    );
    const examScores$ = this.examScoreService.loadExamScores($event);
    forkJoin([archiveFolder$, examScores$])
      .pipe(untilDestroyed(this))
      .subscribe(([archiveFolder, examScore]) => {
        this.examScoreList$$.next(archiveFolder.data);
        this.totalRecords = archiveFolder.data.length;
        this.examScoreList$$.next([
          ...this.examScoreList$$.getValue(),
          ...examScore.data,
        ]);
        this.totalRecords = examScore.total;
        examScore.data.map(
          (item: { hasWritingScore: boolean }) => (item.hasWritingScore = true)
        );
      });
  }

  search() {
    this.event.filters = {
      archiveFolderNr: [
        {
          value: this.selectedExamScoreList?.archiveFolderNr,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
    };
    this.event.first = 0;
    this.getExamScoresListById(this.event);
  }
}
