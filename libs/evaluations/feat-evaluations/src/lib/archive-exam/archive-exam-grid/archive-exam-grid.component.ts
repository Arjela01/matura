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
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
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

  @Input() set studentDetails(details: ArchiveExam | null) {
    if (details) {
      this.barCode = Object.assign({}, details);
    }
  }
  @Input() barCodes: ArchiveExam[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedBarCodes: ArchiveExam[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveExam[]>
  >();

  @Output() formClose = new EventEmitter<undefined>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Output() formSave = new EventEmitter<ArchiveExam>();

  submitted = false;
  id = 0;

  barCode: ArchiveExam = {
    barcode: '',
    archiveFolderId: this.id,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
    }
  }

  ngOnInit() {
    this.barCode = {
      ...this.barCode,
      archiveFolderId: this.id as number,
    };
  }

  onSubmit(): void {
    const data = { ...this.barCode };
    this.archiveExamApiService.save(data).subscribe({
      next: () => {
        this.submitted = false;
      },
    });
  }

  SaveBarCode(barcode: ArchiveExam): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CHANGE,
      data: barcode,
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

  onEditClick(barcode: ArchiveExam) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: barcode,
    } as GridEvent<ArchiveExam>);
  }
  onDeleteClick(barcode: ArchiveExam) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: barcode,
    } as GridEvent<ArchiveExam>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
