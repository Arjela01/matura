import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
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
  ],
  templateUrl: './exam-secrets-tabular-data-entry-list.component.html',
  styleUrls: ['./exam-secrets-tabular-data-entry-list.component.scss'],
})
export class ExamSecretsTabularDataEntryListComponent {
  @Input() dataEntryItemList: ExamSecretTabularDataEntryItem[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() subjectName!: string;
  @Input() examSecretNotes: DropdownModel<string>[] = [];
  @ViewChild('barcodeInput', { read: ElementRef }) barcodeInputs:
    | ElementRef[]
    | any;

  @Input() examSecretSubject: any;
  @Output() barcodeChange = new EventEmitter<any>();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();
  focusedRowIndex: number | null = null;

  constructor(
    private readonly renderer: Renderer2 // ...
  ) {}

  onDeleteClick(examSecret: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSecret,
    } as GridEvent<ExamSecret>);
  }
  onBarcodeChange(barcode: string, rowIndex: number) {
    this.dataEntryItemList[rowIndex].examSecret.barcode = barcode;
  }
  onFocus(rowIndex: number) {
    this.focusedRowIndex = rowIndex;
  }

  onExamSecretAddOrUpdate(examSecret: any, index: number) {
    const updatedExamSecret = {
      ...examSecret,
      examSecretNoteId: examSecret.examSecretNoteId || null,
    };

    // Emit the updated examSecret
    this.barcodeChange.emit(updatedExamSecret);

    // Move focus to the next row's input
    const nextRowIndex = index + 1;
    if (nextRowIndex < this.dataEntryItemList.length) {
      this.focusedRowIndex = nextRowIndex;

      // Set a timeout to ensure the DOM has updated before focusing
      setTimeout(() => {
        const nextRowBarcodeInput = document.getElementById(
          'barcodeInput_' + nextRowIndex
        );
        if (nextRowBarcodeInput) {
          nextRowBarcodeInput.focus();
        }
      }, 0); // Use a small timeout (e.g., 0) to ensure proper focusing
    }
  }
}
