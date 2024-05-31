import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  BARCODE_REGEX,
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';
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
import { BarcodeService } from '../services/barcode-service';
import { ArchiveExam } from '@msh/shared/domain-models';

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
    UpperCaseInputDirective,
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
  barcodePattern = BARCODE_REGEX;

  archiveExam: ArchiveExam = {
    archiveFolderNr: 0,
    id: undefined,
    barcode: '',
    archiveFolderId: this.id,
  };

  constructor(
    private route: ActivatedRoute,
    private barcodeService: BarcodeService
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
      if (value) {
        this.archiveExam.barcode = '';
      }
    });
  }

  barcodeCheck(input: any) {
    const pattern = /^\d{5}[DZ][123Z]$/i;
    return pattern.test(input);
  }

  saveArchiveExam(archiveExam: ArchiveExam): void {
    if (this.barcodeCheck(this.archiveExam?.barcode)) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.CUSTOM_ACTION1,
        data: archiveExam,
      } as GridEvent<ArchiveExam>);
      this.barcodeField?.nativeElement.focus();
    }
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

  protected readonly BARCODE_REGEX = BARCODE_REGEX;
}
