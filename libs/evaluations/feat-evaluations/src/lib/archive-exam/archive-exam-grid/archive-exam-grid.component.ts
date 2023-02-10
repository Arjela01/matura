import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchiveExamApiService } from '@msh/evaluations/data-access-evaluations';
import { ArchiveExam } from '@msh/evaluations/domain-evaluations';
import {BarcodeService} from "../services/barcode-service";

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
  ],
  templateUrl: './archive-exam-grid.component.html',
  styleUrls: ['./archive-exam-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveExamGridComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;

  @ViewChild('barcodeField', {static: true}) barcodeField!: HTMLInputElement;

  @Input() set ArchiveExamsDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }
  @Input() archiveExams: ArchiveExam[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedArchiveExams: ArchiveExam[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveExam[]>
  >();

  @Output() formClose = new EventEmitter<undefined>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Output() formSave = new EventEmitter<ArchiveExam>();

  submitted = false;
  id = 0;

  @Input()
  isBarcodeInputDisabled = false;

  archiveExam: ArchiveExam = {
    id: undefined,
    barcode: '',
    archiveFolderId: this.id,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private router: Router,
    private messageService: MessageService,
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
    this.barcodeService.emptyBarcodeField$.subscribe((value) => {
      if(value == true) {
        this.archiveExam.barcode = '';
        this.barcodeField.focus();

      }
    })
  }

  onSubmit(): void {
    const data = { ...this.archiveExam };
    this.archiveExamApiService.save(data).subscribe({
      next: () => {
        this.submitted = false;
      },
    });
  }

  saveArchiveExam(archiveExam: ArchiveExam): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: archiveExam,
    } as GridEvent<ArchiveExam>);
  }
  onRowUnselect({ data }: { data: ArchiveExam }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ArchiveExam>);
  }
  onRowSelect({ data }: { data: ArchiveExam }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
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

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
