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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ConfirmationService,
  LazyLoadEvent,
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
import { NgForm } from '@angular/forms';
import {ExamSubjectApiService, ExamTypeApiService} from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import {
  ArchiveExam,
  ArchiveFolder,
} from '@msh/evaluations/domain-evaluations';
import {BarcodeCorrectionGridComponent} from "../barcode-correction-grid/barcode-correction-grid.component";
import {BarcodeCorrectionFormComponent} from "../barcode-correction-form/barcode-correction-form.component";
import {DropdownModel} from "@msh/shared/data-access-shared";
import {HttpClient} from "@angular/common/http";

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
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);

  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: LazyLoadEvent | null = null;
  selectedArchiveExam: ArchiveExam | null = null;
  selectedArchiveExams: ArchiveExam[] = [];
  totalRecords = 0;
  id: any;
  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
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

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini dosjen?',
      accept: () => {
        this.toastService.showWarning('Dosja u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<ArchiveFolder | ArchiveFolder[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedArchiveFolders = [
          ...this.selectedArchiveFolders,
          event.data as ArchiveFolder,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedArchiveFolders = this.selectedArchiveFolders.filter(hs => {
          hs.id !== (event.data as ArchiveFolder).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedArchiveFolders = [
          ...this.selectedArchiveFolders,
          ...(event.data as ArchiveFolder[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedArchiveFolders = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedArchiveExam = Object.assign(
          {},
          event.data as ArchiveExam
        );
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(archiveFolder: ArchiveExam) {
    if (archiveFolder.id) {
      this.updateArchiveFolder(archiveFolder);
    }

  }

  getArchiveFolders($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.archiveFolderService
      .barcodeCorrection($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolders$$.next(response.data);
        this.totalRecords = response.total;
      });
  }


  updateArchiveFolder(archiveFolder: ArchiveExam) {
    this.archiveExamService
      .update(archiveFolder)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dosja u ndryshua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dosjes!'
          );
      });
  }


}
