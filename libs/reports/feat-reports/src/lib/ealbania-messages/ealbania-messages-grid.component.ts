import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignalrService } from '@msh/auth/data-access-auth';
import { EalbaniaMessagesApiService } from '@msh/reports/data-access-reports';
import {
  EAlbaniaMessage,
  EAlbaniaMessageStatistics,
  NotificationEnum,
} from '@msh/shared/domain-models';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import {
  ColumnFilterDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'msh-ealbania-messages-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
    CardModule,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
    ConfirmDialogModule,
  ],
  templateUrl: './ealbania-messages-grid.component.html',
  styleUrls: ['./ealbania-messages-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, ConfirmationService],
})
export class EalbaniaMessagesGridComponent implements OnInit, OnDestroy {
  private data$$ = new BehaviorSubject<EAlbaniaMessage[]>([]);
  data$ = this.data$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  stats: EAlbaniaMessageStatistics = {
    errorCount: 0,
    waitingCount: 0,
    successCount: 0,
    needApprovalCount: 0,
  } as EAlbaniaMessageStatistics;

  constructor(
    private readonly ealbaniaMessagesApiService: EalbaniaMessagesApiService,
    private readonly toastService: GlobalToastService,
    private readonly confirmationService: ConfirmationService,
    private readonly cd: ChangeDetectorRef,
    private signalrService: SignalrService
  ) {
    this.ealbaniaMessagesApiService
      .getStatistics()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.stats = response;
        this.cd.markForCheck();
      });
    this.signalrService.startConnection();
  }

  ngOnInit() {
    this.subscribeToStatisticsUpdates();
  }

  ngOnDestroy() {
    this.signalrService.stopConnection();
  }

  private subscribeToStatisticsUpdates() {
    this.signalrService
      .getMessageReceivedObservable()
      .pipe(untilDestroyed(this))
      .subscribe(stats => {
        if (
          stats.notificationEnum.id == NotificationEnum.EalbaniaNotification
        ) {
          this.stats = stats.data;
          this.cd.markForCheck();
        }
      });
  }

  getData($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.ealbaniaMessagesApiService
      .loadData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.data$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  generateGradeMessages() {
    this.ealbaniaMessagesApiService
      .generateGradeMessages()
      .subscribe(result => {
        this.toastService.showSuccess('Njoftimet u gjeneruan me sukses');
        this.getData(this.filters as TableLazyLoadEvent);
      });
  }

  approveGradeMessages() {
    this.ealbaniaMessagesApiService.approveGradeMessages().subscribe(result => {
      this.toastService.showSuccess('Njoftimet u miratuan me sukses');
      this.getData(this.filters as TableLazyLoadEvent);
    });
  }

  deleteGradeMessages() {
    this.ealbaniaMessagesApiService.deleteGradeMessages().subscribe(result => {
      this.toastService.showSuccess('Njoftimet u fshinë me sukses');
      this.getData(this.filters as TableLazyLoadEvent);
    });
  }

  approveMessage(message: any) {
    this.ealbaniaMessagesApiService
      .approveMessage(message.id)
      .subscribe(result => {
        this.toastService.showSuccess('Mesazhi u miratua me sukses');
        this.getData(this.filters as TableLazyLoadEvent);
      });
  }

  deleteMessage(message: any) {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini këtë mesazh?',
      accept: () => {
        this.ealbaniaMessagesApiService
          .deleteMessage(message.id)
          .subscribe(result => {
            this.toastService.showSuccess('Mesazhi u fshi me sukses');
            this.getData(this.filters as TableLazyLoadEvent);
          });
      },
    });
  }
}
