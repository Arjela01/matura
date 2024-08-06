import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { DiplomaRecognition } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, SharedModule } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DiplomaRecognitionService } from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { DiplomaRecognitionGridComponent } from '../diploma-recognition-grid/diploma-recognition-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { StudentsGridComponent } from '../../../../../../applications/feat-applications/src/lib/students/students-grid/students-grid.component';

@Component({
  selector: 'msh-manage-diploma-recognition',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    SharedModule,
    DiplomaRecognitionGridComponent,
  ],
  templateUrl: './manage-diploma-recognition.component.html',
  styleUrls: ['./manage-diploma-recognition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageDiplomaRecognitionComponent {
  private diplomaRecognition$$ = new BehaviorSubject<DiplomaRecognition[]>([]);
  diplomaRecognition$ = this.diplomaRecognition$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  id: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
  totalRecords = 0;
  selectedDiplomaRecognitionRecord: DiplomaRecognition | null = null;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly diplomaRecognitionService: DiplomaRecognitionService,
    private readonly router: Router,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getDiplomaRecognitionRecords(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.router.navigate(['/evaluations/diploma-recognition/add']);
  }

  onGridEvent(event: GridEvent<any | DiplomaRecognition[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.id = event.data.id;
        this.headerText = `Historiku për Kërkesën {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedDiplomaRecognitionRecord = Object.assign(
          {},
          event.data as DiplomaRecognition
        );
        this.router.navigate([
          'evaluations',
          'diploma-recognition',
          'edit',
          this.selectedDiplomaRecognitionRecord.id,
        ]);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurtë që doni të fshini kërkesën për njësimin e diplomës?',
          accept: () => {
            this.deleteExamType(event.data as DiplomaRecognition);
          },
        });
        break;
    }
  }

  getDiplomaRecognitionRecords($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.diplomaRecognitionService
      .loadData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.diplomaRecognition$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  deleteExamType(diplomaRecognition: DiplomaRecognition) {
    this.diplomaRecognitionService
      .delete(diplomaRecognition.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Formulari për njësimin e diplomës u fshi me sukses!'
          );
          this.getDiplomaRecognitionRecords(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së formularit për njësimin e diplomës!'
          );
      });
  }
}
