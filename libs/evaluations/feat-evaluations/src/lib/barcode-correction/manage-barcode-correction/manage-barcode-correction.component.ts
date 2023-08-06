import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import { BarcodeCorrectionGridComponent } from '../barcode-correction-grid/barcode-correction-grid.component';
import { BarcodeCorrectionFormComponent } from '../barcode-correction-form/barcode-correction-form.component';
import { HttpClient } from '@angular/common/http';
import { ArchiveExam, BarcodeCorrection } from '@msh/shared/domain-models';
import {TableLazyLoadEvent} from "primeng/table";

@UntilDestroy()
@Component({
  selector: 'msh-manage-barcode-correction',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    BarcodeCorrectionFormComponent,
    ToolbarModule,
    RouterLink,
    BarcodeCorrectionGridComponent,
  ],
  templateUrl: './manage-barcode-correction.component.html',
  styleUrls: ['./manage-barcode-correction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageBarcodeCorrectionComponent {
  private archiveFolders$$ = new BehaviorSubject<BarcodeCorrection[]>([]);

  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  selectedArchiveExam: ArchiveExam | null = null;
  selectedArchiveExams: BarcodeCorrection[] = [];
  totalRecords = 0;
  id: any;
  selectedArchiveFolder: BarcodeCorrection | null = null;
  selectedArchiveFolders: BarcodeCorrection[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private archiveExamService: ArchiveExamApiService,
    private readonly examSubjectApiService: ExamSubjectApiService,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  onNewClick() {
    this.displayModal = true;
  }

  onGridEvent(event: GridEvent<BarcodeCorrection | BarcodeCorrection[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedArchiveFolders = [
          ...this.selectedArchiveFolders,
          event.data as BarcodeCorrection,
        ];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedArchiveExam = Object.assign({}, event.data as ArchiveExam);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(archiveExam: ArchiveExam) {
    if (archiveExam.id) {
      this.updateArchiveFolder(archiveExam);
    }
  }

  getArchiveFolders($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.archiveFolderService
      .barcodeCorrection($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolders$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  updateArchiveFolder(archiveExam: ArchiveExam) {
    this.archiveExamService
      .update(archiveExam)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Barkodi u ndryshua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së barkodit!'
          );
      });
  }
}
