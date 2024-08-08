import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { DiplomaRequest } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DiplomaRequestApiService } from '@msh/applications/data-access-applications';
import { Button, ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DiplomasStudentFormComponent } from '../../diplomas-student/diplomas-student-form/diplomas-student-form.component';
import { DiplomasStudentGridComponent } from '../../diplomas-student/diplomas-student-grid/diplomas-student-grid.component';
import { Ripple } from 'primeng/ripple';
import { DiplomaRequestGridComponent } from '../diploma-request-grid/diploma-request-grid.component';
import { DiplomaRequestFormComponent } from '../diploma-request-form/diploma-request-form.component';
import { Router } from '@angular/router';
import { StudentsGridComponent } from '../../students/students-grid/students-grid.component';

@UntilDestroy()
@Component({
  selector: 'manage-diploma-request',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    ButtonDirective,
    ConfirmDialogModule,
    DialogModule,
    DiplomasStudentFormComponent,
    DiplomasStudentGridComponent,
    PrimeTemplate,
    Ripple,
    DiplomaRequestGridComponent,
    DiplomaRequestFormComponent,
    StudentsGridComponent,
  ],
  providers: [DatePipe, ConfirmationService],
  templateUrl: './manage-diploma-request.component.html',
  styleUrl: './manage-diploma-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageDiplomaRequestComponent {
  private diplomaRequests$$ = new BehaviorSubject<DiplomaRequest[]>([]);
  diplomaRequests$ = this.diplomaRequests$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  selectedDiplomaRequest: DiplomaRequest | null = null;
  displayModal = false;
  id: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly diplomaRequestService: DiplomaRequestApiService,
    private cd: ChangeDetectorRef,
    private readonly authFacade: AuthFacade,
    private readonly router: Router
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getDiplomaRequests(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.displayModal = true;
    this.selectedDiplomaRequest = {} as DiplomaRequest;
  }

  onModalClose() {
    this.displayModal = false;
  }

  onGridEvent(event: GridEvent<any | DiplomaRequest[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.id = event.data.id;
        this.headerText = `Historiku për Kërkesën {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedDiplomaRequest = Object.assign(
          {},
          event.data as DiplomaRequest
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini kërkesën e zgjedhur?',
          accept: () => {
            this.deleteRequest(event.data as DiplomaRequest);
          },
        });
        break;
    }
  }

  onFormSave(diplomaRequest: any) {
    if (diplomaRequest.id) {
      this.updateRequest(diplomaRequest);
    }
    if (!diplomaRequest.id) {
      this.addRequest(diplomaRequest);
    }
  }

  getDiplomaRequests($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.diplomaRequestService
      .loadDiplomaRequests($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.diplomaRequests$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  addRequest(diplomaRequest: DiplomaRequest) {
    this.diplomaRequestService
      .save(diplomaRequest)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Kërkesa u shtua me sukses!');
          this.router.navigate([
            `/applications/diploma-request/${response.data.id}`,
          ]);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të kërkesës!'
          );
        this.cd.markForCheck();
      });
  }

  updateRequest(diplomaRequest: DiplomaRequest) {
    this.diplomaRequestService
      .update(diplomaRequest)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Ndryshimi u ruajt me sukses!');
          this.router.navigate([
            `/applications/diploma-request/${this.selectedDiplomaRequest?.id}`,
          ]);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të kërkesës!'
          );
      });
  }

  deleteRequest(diplomaRequest: DiplomaRequest) {
    this.diplomaRequestService
      .delete(diplomaRequest.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Kërkesa u fshi me sukses!');
          this.getDiplomaRequests(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së kërkesës!'
          );
      });
  }
}
