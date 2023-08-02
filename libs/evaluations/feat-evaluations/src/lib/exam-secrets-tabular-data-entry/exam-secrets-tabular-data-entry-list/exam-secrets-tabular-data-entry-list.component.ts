import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  ExamSecret,
  ExamSecretTabularDataEntryItem,
} from '@msh/evaluations/domain-evaluations';
import {
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secrets-tabular-data-entry-list',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './exam-secrets-tabular-data-entry-list.component.html',
  styleUrls: ['./exam-secrets-tabular-data-entry-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsTabularDataEntryListComponent {
  @Input() dataEntryItemList: ExamSecretTabularDataEntryItem[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() subjectName: any;
  @Input() examSecretSubject: any;
  @Output() barcodeChange = new EventEmitter<any>();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();

  onDeleteClick(examSecret: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSecret,
    } as GridEvent<ExamSecret>);
  }
  onExamSecretAddOrUpdate(examScores: any) {
    this.barcodeChange.emit(examScores);
  }
}
