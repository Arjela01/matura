import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchiveExamApiService } from '@msh/evaluations/data-access-evaluations';
import { BarcodeService } from '../services/barcode-service';
import { ArchiveExam } from '@msh/shared/domain-models';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'msh-archive-exam-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    FormsModule,
    ColumnFilterDirective,
  ],
  templateUrl: './archive-exam-grid.component.html',
  styleUrls: ['./archive-exam-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveExamGridComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  @ViewChild('barcodeField', { static: true }) barcodeField:
    | ElementRef
    | undefined;

  @Input() set ArchiveExamsDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }
  @Input() archiveExams: ArchiveExam[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() isBarcodeInputDisabled = false;

  selectedArchiveExams: ArchiveExam[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveExam[]>
  >();

  @Output() formClose = new EventEmitter<undefined>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  @Output() formSave = new EventEmitter<ArchiveExam>();

  submitted = false;
  id = 0;

  archiveExam: ArchiveExam = {
    archiveFolderNr: 0,
    id: undefined,
    barcode: '',
    archiveFolderId: this.id,
  };

  constructor(
    private route: ActivatedRoute,
    private barcodeService: BarcodeService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
    }
  }

  ngOnInit() {
    this.archiveExam = {
      ...this.archiveExam,
      archiveFolderId: this.id as number,
    };
    this.barcodeService.emptyBarcodeField$.subscribe(value => {
      if (value == true) {
        this.archiveExam.barcode = '';
      }
    });
  }

  lettersNumbersCheck(input: any) {
    const numberRegex = /\d/;
    const characterRegex = /[a-zA-Z]/;
    const barcode = this.archiveExam?.barcode;
    return (
      barcode &&
      barcode.length === 7 &&
      numberRegex.test(input) &&
      characterRegex.test(input)
    );
  }

  saveArchiveExam(archiveExam: ArchiveExam): void {
    if (this.lettersNumbersCheck(this.archiveExam?.barcode)) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.CUSTOM_ACTION1,
        data: archiveExam,
      } as GridEvent<ArchiveExam>);
      this.barcodeField?.nativeElement.focus();
    }
  }
  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<ArchiveExam>);
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<ArchiveExam>);
  }

  onEditClick(archiveExam: ArchiveExam) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveExam,
    } as GridEvent<ArchiveExam>);
  }
  onDeleteClick(archiveExam: ArchiveExam) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveExam,
    } as GridEvent<ArchiveExam>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
