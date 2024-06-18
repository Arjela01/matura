import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AdministrationOfficeApiService,
  DiplomasStudentApiService,
  HighSchoolApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { Diploma, Student, StudentType } from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  skip,
  tap,
} from 'rxjs';
import { DiplomasStudentFormComponent } from '../diplomas-student-form/diplomas-student-form.component';
import { DiplomasStudentGridComponent } from '../diplomas-student-grid/diplomas-student-grid.component';
import { TableLazyLoadEvent } from 'primeng/table';
import { PrintedDiplomasForeignStudentsComponent } from '../printed-diplomas-foreign-students/printed-diplomas-foreign-students.component';

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
    PrintedDiplomasForeignStudentsComponent,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-diplomas-student.component.html',
  styleUrls: ['./manage-diplomas-student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageDiplomasStudentComponent implements OnInit {
  @Input() printed = false;
  @Input() title = 'Diplomat';
  @Input() foreignStudent = false;
  private diplomaList$$ = new BehaviorSubject<Diploma[]>([]);
  diplomaList$ = this.diplomaList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  displayModal = false;
  diplomaStatus!: any;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedAction!: string;
  responseLoaded = new BehaviorSubject<boolean>(false);

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
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService,
    private diplomasService: DiplomasStudentApiService,
    private administrationOfficeApiService: AdministrationOfficeApiService,
    private highschoolApiService: HighSchoolApiService,
    private authFacade: AuthFacade,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getStudentSealSummary();
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

  onFormSave(data: string) {
    if (this.selectedAction === 'print') {
      this.printAllDiplomas(data);
    } else if (this.selectedAction === 'seal') {
      this.sealAllDiplomas(data);
    }
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

  sealAllDiplomas(data: string) {
    this.responseLoaded.next(true);
    this.diplomasService
      .printAllElectronicSeal(data)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response === true) {
          this.toastService.showInfo('Filloi procesi i vulosjes së diplomave!');
        } else {
          this.toastService.showError('Ndodhi një gabim!');
        }
      })
      .add(() => this.responseLoaded.next(false));
  }

  printAllDiplomas(data: string) {
    this.diplomasService.exportAllDiplomas(data).subscribe(
      response => {
        const blob = new Blob([response], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(blob, `Diplomat`);
        this.displayModal = false;
        this.getStudentDiplomas(this.filters as TableLazyLoadEvent);
      },
      err => {
        this.toastService.showError(err.error);
      }
    );
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
      message: 'Jeni i sigurt që doni të refuzoni formularin?',
      accept: () => {
        this.diplomasService.generateDiplomas().subscribe(response => {
          this.toastService.showSuccess('Diplomat u gjeneruan me sukses');
        });
      },
    });
  }
}
