import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade, SignalrService } from '@msh/auth/data-access-auth';
import {
  AdministrationOfficeApiService,
  DiplomasStudentApiService,
  HighSchoolApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  Diploma,
  EAlbaniaMessageStatistics,
  NotificationEnum,
  Student,
  StudentType,
} from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  skip,
  tap,
} from 'rxjs';
import { DiplomasStudentFormComponent } from '../diplomas-student-form/diplomas-student-form.component';
import { DiplomasStudentGridComponent } from '../diplomas-student-grid/diplomas-student-grid.component';

@Component({
  selector: 'msh-manage-diplomas-student',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    DiplomasStudentFormComponent,
    DiplomasStudentGridComponent,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-diplomas-student.component.html',
  styleUrls: ['./manage-diplomas-student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageDiplomasStudentComponent implements OnInit, OnDestroy {
  private diplomaList$$ = new BehaviorSubject<Diploma[]>([]);
  diplomaList$ = this.diplomaList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  displayModal = false;
  diplomaStatus!: any;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedAction!: string;
  responseLoaded = new BehaviorSubject<boolean>(false);
  status: EAlbaniaMessageStatistics = {
    errorCount: 0,
    waitingCount: 0,
    successCount: 0,
    needApprovalCount: 0,
  } as EAlbaniaMessageStatistics;
  studentTypes: DropdownModel<number>[] = [
    {
      key: StudentType.PreviousStudent,
      value: 'Maturant i kaluar',
      parentKey: null,
    },
    {
      key: StudentType.CurrentStudent,
      value: 'Maturant i sivjetshëm',
      parentKey: null,
    },
  ];
  administrationOffices: DropdownModel<number>[] = [];
  highSchools$$: BehaviorSubject<DropdownModel<number>[]> = new BehaviorSubject<
    DropdownModel<number>[]
  >([]);
  highSchools$ = this.highSchools$$.asObservable() as Observable<
    DropdownModel<number>[]
  >;

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getStudentDiplomas(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly toastService: GlobalToastService,
    private diplomasService: DiplomasStudentApiService,
    private administrationOfficeApiService: AdministrationOfficeApiService,
    private highschoolApiService: HighSchoolApiService,
    private authFacade: AuthFacade,
    private confirmationService: ConfirmationService,
    private readonly signalrService: SignalrService
  ) {
    this.signalrService.startConnection();
  }

  ngOnInit(): void {
    this.subscribeToStatisticsUpdates();
    this.getAdministrationOfficeDropdown();
    this.getStudentSealSummary();
  }

  ngOnDestroy() {
    this.signalrService.stopConnection();
  }

  private subscribeToStatisticsUpdates() {
    this.signalrService
      .getMessageReceivedObservable()
      .pipe(untilDestroyed(this))
      .subscribe(status => {
        if (status.notificationEnum == NotificationEnum.DiplomaNotification) {
          this.status = status.data;
          this.cd.markForCheck();
        }
      });
  }

  onNewClick(action: string) {
    this.selectedAction = action;
    this.displayModal = true;
  }

  onModalClose() {
    this.displayModal = false;
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
      });
  }

  getHighSchoolsDropdown() {
    this.highschoolApiService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchools$$.next(response.data);
      });
  }

  onGridEvent(event: GridEvent<Diploma>) {
    switch (event.action) {
      case GRID_ACTIONS.PRINT:
        this.printDiploma(event);
        break;
      case GRID_ACTIONS.SEAL:
        this.sealDiploma(event);
        break;
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.sendToEalbaniaByStudentId(event);
        break;
    }
  }

  printDiploma(event: GridEvent<Diploma>) {
    this.diplomasService
      .print(event.data?.studentId as string)
      .subscribe((response: any) => {
        if (response.type == 'application/json') {
          response.text().then((data: any) => {
            this.toastService.showError(JSON.parse(data).errorMessage);
          });
        } else {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          FileSaver.saveAs(blob, `Diploma_${event.data?.studentStudentId}`);
          this.getStudentDiplomas(this.filters as TableLazyLoadEvent);
        }
      });
  }

  sealDiploma(event: GridEvent<Diploma>) {
    this.diplomasService
      .printSealed(event.data?.studentId as string)
      .subscribe((response: any) => {
        if (response.type == 'application/json') {
          response.text().then((data: any) => {
            this.toastService.showError(JSON.parse(data).errorMessage);
          });
        } else {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          FileSaver.saveAs(
            blob,
            `Diploma_Sealed_${event.data?.studentStudentId}`
          );
          this.getStudentDiplomas(this.filters as TableLazyLoadEvent);
        }
      })
      .add(() => this.responseLoaded.next(false));
  }

  sendToEalbaniaByStudentId(event: GridEvent<Diploma>) {
    this.diplomasService
      .sendToEalbaniaByStudentId(event.data?.studentId as string)
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Diploma u dërgua me sukses');
        } else {
          this.toastService.showError(response.errorMessage);
        }
      })
      .add(() => this.responseLoaded.next(false));
  }

  getHighSchoolsByOffice(administrationOfficeId: string): void {
    this.highschoolApiService
      .forAdministrationOffice(administrationOfficeId)
      .subscribe(response => {
        this.highSchools$$.next(response.data as any);
      });
  }

  getStudentDiplomas($event: TableLazyLoadEvent): void {
    this.filters = $event;

    this.diplomasService
      .loadDiplomas($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const diplomas = [...response.data];
        this.diplomaList$$.next(diplomas);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  getStudentSealSummary() {
    this.diplomasService
      .getStudentSealSummary()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.diplomaStatus = res.data;
      });
  }

  generateDiplomas() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të gjeneroni diplomat?',
      accept: () => {
        this.diplomasService.generateDiplomas().subscribe(response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Diplomat u gjeneruan me sukses');
          } else {
            this.toastService.showError(response.errorMessage);
          }
          this.getStudentDiplomas(this.filters as TableLazyLoadEvent);
        });
      },
    });
  }

  sendToEAlbania() {
    this.confirmationService.confirm({
      message:
        'Jeni i sigurt që doni të filloni procesin për dërgimin në eAlbania?',
      accept: () => {
        this.diplomasService.sendToEAlbania().subscribe(response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Diplomat u gjeneruan me sukses');
          } else {
            this.toastService.showError(response.errorMessage);
          }
          this.cd.markForCheck();
        });
      },
    });
  }
}
