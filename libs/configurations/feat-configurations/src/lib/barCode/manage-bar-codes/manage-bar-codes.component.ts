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
  AddBarcodeApiService,
  ArchiveFolderApiService,
  ExamTypeApiService,
  ExamVersionApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import {
  AddBarcode, ArchiveFolder,


} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BarCodeGridComponent } from '../bar-code-grid/bar-code-grid.component';
import { NgForm } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'msh-manage-bar-codes',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    BarCodeGridComponent,
    ToolbarModule,
    RouterLink,
  ],
  templateUrl: './manage-bar-codes.component.html',
  styleUrls: ['./manage-bar-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageBarCodesComponent implements OnInit {
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<AddBarcode | AddBarcode[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Output() formSave = new EventEmitter<AddBarcode>();

  @Input() set barCodeDetails(details: AddBarcode | null) {
    if (details) {
      this.barCode = Object.assign({}, details);
    }
  }

  @ViewChild('form', {static: true}) form!: NgForm;

  private barCodes$$ = new BehaviorSubject<AddBarcode[]>([]);
  barCodes$ = this.barCodes$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;

  selectedBarCode: AddBarcode | null = null;
  selectedBarCodes: AddBarcode[] = [];
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly barCodesService: AddBarcodeApiService,
    private readonly examVersionApiService: ExamVersionApiService,
    private readonly studentAPITestService: StudentsApiService,
    private router: Router,
    private messageService: MessageService,
    private readonly archivefolder: ArchiveFolderApiService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

  }
  archiveFolder: ArchiveFolder = {
    nr: 0,
    isClosed: false,
    lastUserId: undefined,
    id: 0,
    examTypeId: 0,
    examSubjectId: ""
  };
  barCode: AddBarcode = {
    index: 0,
    archiveFolderId: 0,
    barCode: "",
  };
  id: string | null;

  ngOnInit(): void {
    this.barCodesService.getById(this.id).subscribe(result => {
      this.barCode = {...result.data};
      this.cd.detectChanges();
    });
  }

  onCloseClick() {
    this.router.navigate(['/configurations/students']).then();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini shkollat e zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('Shkollat e zgjedhura u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<AddBarcode | AddBarcode[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedBarCodes = [
          ...this.selectedBarCodes,
          event.data as AddBarcode,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedBarCodes = this.selectedBarCodes.filter(hs => {
          hs.archiveFolderId !== (event.data as AddBarcode).archiveFolderId;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedBarCodes = [
          ...this.selectedBarCodes,
          ...(event.data as AddBarcode[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedBarCodes = [];
        break;
      case GRID_ACTIONS.EDIT:
        // eslint-disable-next-line max-len
        this.selectedBarCode = Object.assign(
          {},
          event.data as AddBarcode
        );
        this.displayModal = true;
        break;
      // case GRID_ACTIONS.DELETE:
      //   this.confirmationService.confirm({
      //     message: 'Jeni i sigurt që doni të fshini shkollën e zgjedhur?',
      //     accept: () => {
      //       this.deleteBarCode(event.data as AddBarcode);
      //     },
      //   });
      //   break;
      case GRID_ACTIONS.CHANGE:
        this.confirmationService.confirm({
          message: 'Doni te shtoni Barkodin?',
          accept: () => {
            this.addBarCode(event.data as AddBarcode);
            },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(barCode: AddBarcode) {
    if (barCode.barCode) {
      this.updateBarCode(barCode);
    }
    if (!barCode.barCode) {
      this.addBarCode(barCode);
    }
  }

  getBarCodes($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.barCodesService
      .loadAddBarcode($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barCodes$$.next([]);
        this.barCodes$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addBarCode(barCode: AddBarcode) {
    this.barCodesService
      .save(barCode)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Shkolla e mesme u shtua me sukses!');
          this.displayModal = false;
          this.getBarCodes(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  updateBarCode(barCode: AddBarcode) {
    this.barCodesService
      .update(barCode)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Shkolla e mesme u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getBarCodes(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }
}
//   deleteBarCode(barcode: AddBarcode) {
//     this.barCodesService
//       .delete(barcode.barCode)
//       .pipe(untilDestroyed(this))
//       .subscribe(response => {
//         if (response.isSuccessful) {
//           this.toastService.showInfo('Shkolla e mesme u fshi me sukses!');
//           this.getBarCodes(this.filters as LazyLoadEvent);
//         }
//
//         if (response.isBadRequest)
//           this.toastService.showError(
//             'Ndodhi një problem gjatë fshirjes së shkollës së mesme!'
//           );
//       });
//   }
// }
