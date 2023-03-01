import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/evaluations/domain-evaluations';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ExamCopyGridComponent } from '../exam-copy-grid/exam-copy-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-copy',
  standalone: true,
  templateUrl: './manage-exam-copy.component.html',
  styleUrls: ['./manage-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ToolbarModule,
    RippleModule,
    ExamCopyGridComponent,
  ],
})
export class ManageExamCopyComponent implements OnInit {
  private examCopies$$ = new BehaviorSubject<ExamCopy[]>([]);
  examCopies$ = this.examCopies$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onGridEvent(event: GridEvent<ExamCopy | ExamCopy[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        console.log(event.data);
        break;
    }
  }

  getExamCopies($event: any) {
    //   this.examCopyService
    //     .getExamCopies(this.filters)
    //     .pipe(untilDestroyed(this))
    //     .subscribe(
    //       (response) => {
    //         this.examCopies$$.next(response.data);
    //         this.totalRecords = response.totalRecords;
    //         this.cd.markForCheck();
    //       },
    //       (error) => {
    //         this.toastService.showError(error);
    //       }
    //     );
    // }
    console.log('getExamCopies');
  }
}
