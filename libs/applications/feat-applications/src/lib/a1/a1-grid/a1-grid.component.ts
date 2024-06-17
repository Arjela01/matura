import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { A1ApiService } from '@msh/applications/data-access-applications';
import { A1Z, A1ZTableRecord } from '@msh/applications/domain-application';
import {
  AuthFacade,
  PermissionCheckService,
  PermissionEnum,
} from '@msh/auth/data-access-auth';
import { AcademicYear, Student } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { A1HistoryGridComponent } from '../a1-history/a1-history-grid.component';
import {AppDatePipe} from "@msh/shared/ui-shared";
@Component({
  selector: 'a1-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    TableModule,
    ColumnFilterDirective,
    RouterLink,
    A1HistoryGridComponent,
    AppDatePipe,
  ],
  templateUrl: './a1-grid.component.html',
  styleUrls: ['./a1-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, DialogService],
})
@UntilDestroy()
export class A1GridComponent implements OnInit {
  private a1$$ = new BehaviorSubject<A1Z[]>([]);
  a1$ = this.a1$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  students: Student[] = [];
  totalRecords = 0;
  displayForm = false;
  headerText: any;
  displayHistoryForm = false;
  gridAction = GRID_ACTIONS;
  ref: DynamicDialogRef | null = null;
  academicYear: AcademicYear | null = null;

  studentId: number | undefined;
  selectedRecord: any;
  showEditButton = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly a1ApiService: A1ApiService,
    private router: Router,
    private authFacade: AuthFacade,
    private readonly permissionCheckService: PermissionCheckService
  ) {}

  ngOnInit() {
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
  }
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getA1(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  onNewClick() {
    this.router.navigate(['applications/a1/add']);
  }
  onHistoryModalClose() {
    this.displayHistoryForm = false;
  }
  updateA1(a1: A1Z) {
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
          this.getA1(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      });
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini formularët A1 të zgjedhur?',
      accept: () => {
        this.toastService.showWarning('Formularët A1 të zgjedhur u fshinë!');
      },
    });
  }

  onGridEvent(action: GRID_ACTIONS, event: any) {
    switch (action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.studentId = event.id;
        this.headerText = `Historiku për Formularin A1 {${event.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.router.navigate([`applications/a1/edit/${event.id}`]);
        this.displayForm = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini formularët e zgjedhur?',
          accept: () => {
            this.deleteA1(event as A1Z);
          },
        });
        break;
    }
  }
  deleteA1(a1: A1Z) {
    if (!a1.id) return;

    this.a1ApiService
      .delete(a1.id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Formulari A1 u fshi me sukses!');
          this.getA1(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së formularit A1!'
          );
      });
  }

  getA1($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.a1ApiService
      .loadA1($event)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.a1$$.next(response.data);
        this.totalRecords = response.total;
        this.displayForm = false;
      });
  }
  onViewClick(a1: A1ZTableRecord) {
    this.router.navigate([`/applications/a1/view/${a1.id}`]);
  }

  protected readonly PermissionEnum = PermissionEnum;
}
