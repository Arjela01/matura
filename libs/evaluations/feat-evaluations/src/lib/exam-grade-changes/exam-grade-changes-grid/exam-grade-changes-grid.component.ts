import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExamGradeChange } from '@msh/shared/domain-models';
import { DialogModule } from 'primeng/dialog';
import { AppBoolPipe, AppTimePipe } from '@msh/shared/ui-shared';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'msh-exam-grade-changes-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
    DialogModule,
    AppTimePipe,
    AppBoolPipe,
    RouterLink,
  ],
  templateUrl: './exam-grade-changes-grid.component.html',
  styleUrls: ['./exam-grade-changes-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ExamGradeChangesGridComponent {
  @Input() examGradeChanges: ExamGradeChange[] = [];
  @Input() totalRecords = 0;
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
