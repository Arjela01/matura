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
  BARCODE_REGEX,
  GRID_ACTIONS,
  GridEvent,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import {
  ExamSecret,
  ExamSecretTabularDataEntryItem,
} from '@msh/shared/domain-models';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModel } from '@msh/shared/data-access-shared';

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
    TooltipModule,
    UpperCaseInputDirective,
  ],
  templateUrl: './exam-secrets-tabular-data-entry-list.component.html',
  styleUrls: ['./exam-secrets-tabular-data-entry-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsTabularDataEntryListComponent {
  @Input() dataEntryItemList: ExamSecretTabularDataEntryItem[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() subjectName!: string;
  @Input() examSecretNotes: DropdownModel<string>[] = [];

  @Input() examSecretSubject: any;
  @Output() barcodeChange = new EventEmitter<any>();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();
  barcodePattern = BARCODE_REGEX;

  onDeleteClick(examSecret: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSecret,
    } as GridEvent<ExamSecret>);
  }
  onExamSecretAddOrUpdate(examSecret: any) {
    this.barcodeChange.emit(examSecret);
  }

  protected readonly BARCODE_REGEX = BARCODE_REGEX;
}
