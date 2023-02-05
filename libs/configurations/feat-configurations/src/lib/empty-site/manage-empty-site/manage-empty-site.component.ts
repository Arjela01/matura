import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import {ExamSite} from "@msh/configurations/domain-configurations";
import {EmptySiteApiService, ExamSiteApiService} from "@msh/configurations/data-access-configurations";
import {EmptySiteGridComponent} from "../empty-site-grid/empty-site-grid.component";

@Component({
  selector: 'msh-manage-empty-site',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    RouterLink,
    EmptySiteGridComponent,
  ],
  templateUrl: './manage-empty-site.component.html',
  styleUrls: ['./manage-empty-site.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageEmptySiteComponent {
  private examAssignmentList$$ = new BehaviorSubject<ExamSite[]>([]);
  examAssignmentList$ = this.examAssignmentList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;

  constructor(
    //private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    //private readonly examAssignmentService: ExamAssignmentApiService,
    private emptySiteService: EmptySiteApiService,
  ) {}

  // onGridEvent(event: GridEvent<ExamAssignment | ExamAssignment[]>) {
  //   switch (event.action) {
  //     case GRID_ACTIONS.REJECT:
  //       this.confirmationService.confirm({
  //         message: 'Jeni i sigurtë që doni të zbrazni  qendren?',
  //         accept: () => {
  //          //this.emptySite(event.data as ExamSite);
  //         },
  //       });
  //       break;
  //   }
  // }
  // emptySite(ExamAssignment: ExamAssignment) {
  //   this.examAssignmentService
  //     .emptySite(ExamSite.id)
  //     .pipe(untilDestroyed(this))
  //     .subscribe(response => {
  //       if (response.isSuccessful) {
  //         this.toastService.showSuccess('Qendra u zbras me sukses!');
  //         this.getExamSite(this.filters as LazyLoadEvent);
  //       }
  //       if (!response.isSuccessful) {
  //         this.toastService.showError('Ndodhi një problem!');
  //       }
  //     });
  // }

  getExamAssignment($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    this.emptySiteService
      .loadExamSites($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const examSites = [...response.data];
        console.log(111 , examSites)
        this.examAssignmentList$$.next(examSites);
        this.totalRecords = response.total;
      });
  }
}
