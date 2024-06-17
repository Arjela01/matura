import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ArchiveExam, ArchiveFolder } from '@msh/shared/domain-models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, filter, map, of, switchMap } from 'rxjs';
import { ArchiveFormComponent } from '../archive-exam-form/archive-form.component';
import { ArchiveExamGridComponent } from '../archive-exam-grid/archive-exam-grid.component';

import { GlobalToastService } from '@msh/shared/util-shared';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppDatePipe } from '@msh/shared/ui-shared';
@UntilDestroy()
@Component({
  selector: 'msh-manage-archive-exams',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ArchiveExamGridComponent,
    ToolbarModule,
    RouterLink,
    ArchiveFormComponent,
    DatePipe,
    AppDatePipe,
  ],
  templateUrl: './archive-exam-report.component.html',
  styleUrls: ['./archive-exam-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ArchiveExamReportComponent implements OnInit {
  private archiveFolderSubject = new BehaviorSubject<ArchiveFolder | null>(
    null
  );
  archiveFolder$ = this.archiveFolderSubject.asObservable();

  archiveExams$ = this.archiveFolder$.pipe(
    filter(archiveFolder => !!archiveFolder), // Ensure archiveFolder exists
    switchMap(archiveFolder =>
      archiveFolder
        ? this.archiveExamApiService.getExamsByFolderId(archiveFolder.id)
        : of(null)
    ),
    map(archiveExam =>
      archiveExam?.isSuccessful
        ? (archiveExam.data as Array<ArchiveExam>)
        : null
    )
  );

  constructor(
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private readonly route: ActivatedRoute,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(paramMap => !!paramMap.get('id')),
        switchMap(paramMap =>
          this.archiveFolderService.getById(paramMap.get('id'))
        ),
        map(response => (response.isSuccessful ? response.data : null))
      )
      .subscribe(response => {
        this.archiveFolderSubject.next(response);
      });
  }

  today = new Date();

  printReport() {
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
    });

    const font = 'arial';

    this.archiveFolderSubject.subscribe(folder => {
      if (folder) {
        doc.setFontSize(12).setFont(font);

        const pageWidth: number = doc.internal.pageSize.width;
        const pageHorizCenter: number = pageWidth / 2;

        let row = 20;
        const row_size = 8;

        const offset = 50;

        doc.text(`Dosja`, 10, row).setFont(font, 'bold');
        doc.text(`${folder.nr}`, offset, row).setFont(font, 'normal');

        doc
          .text(`Data`, pageHorizCenter + offset / 2, row)
          .setFont(font, 'bold');
        doc
          .text(
            `${this.today.toLocaleDateString('en-GB')}`,
            pageHorizCenter + offset,
            row
          )
          .setFont(font, 'normal');
        row += row_size;

        doc.text(`Emri i Lëndës`, 10, row).setFont(font, 'bold');
        doc
          .text(` ${folder.examSubjectName}`, offset, row)
          .setFont(font, 'normal');
        row += row_size;

        doc.text(`Tipi i Lëndës`, 10, row).setFont(font, 'bold');
        doc.text(`${folder.examTypeName}`, offset, row).setFont(font, 'normal');
        row += row_size;

        doc.text('Inventari i Dosjes', 10, (row += row_size * 1.5));

        autoTable(doc, {
          html: '#my-table',
          margin: { right: 110, left: 10, bottom: 0, top: 0 },
          startY: (row += row_size * 0.5),
          theme: 'grid',
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
          },
          styles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
          },
        });

        autoTable(doc, {
          html: '#my-table-2',
          margin: { right: 10, left: 110, bottom: 0, top: 0 },
          startY: row,
          theme: 'grid',
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
          },
          styles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
          },
        });

        doc.save(`dosje-${folder.nr}-${folder.examSubjectName}.pdf`);
      } else {
        this.toastService.showError('Ndodhi një problem!');
      }
    });
  }

  printContent(content: string) {
    const printContent = document.getElementById(content);
    if (printContent) {
      const printContents = printContent.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  }
}
