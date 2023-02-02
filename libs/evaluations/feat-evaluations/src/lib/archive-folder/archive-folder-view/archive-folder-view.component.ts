import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ArchiveExamApiService } from '@msh/evaluations/data-access-evaluations';
import { ArchiveExam } from '@msh/evaluations/domain-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-archive-folder-view',
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
    ToolbarModule,
    RouterLink,
  ],
  templateUrl: './archive-folder-view.component.html',
  styleUrls: ['./archive-folder-view.component.scss'],
})
export class ArchiveFolderViewComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  id = 0;

  barCode: ArchiveExam = {
    barcode: '',
    archiveFolderId: this.id,
  };
  barcodes: ArchiveExam[] = [];
  totalRecords = 0;

  constructor(
    private cd: ChangeDetectorRef,
    private barcodeApiService: ArchiveExamApiService,
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
    this.barcodeApiService.save(data).subscribe({
      next: () => {
        this.submitted = false;
      },
    });
  }

  loadRows($event: LazyLoadEvent) {
    this.barcodeApiService
      .loadArchiveExams($event, this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barcodes = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
