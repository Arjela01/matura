import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { ApplicationProcess } from '@msh/evaluations/domain-evaluations';
import { Application_Process } from '../grid/grid-type.enum';
import { GlobalToastService } from '@msh/shared/util-shared';
import { CalculationProcessesApiService } from '@msh/evaluations/data-access-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-calculate-grades',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    RippleModule,
    GridComponent,
  ],
  templateUrl: './connect-exam-secrets.component.html',
  styleUrls: ['./connect-exam-secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectExamSecretsComponent {
  private calculateGrade$$ = new BehaviorSubject<ApplicationProcess[]>([]);
  calculateGrade$ = this.calculateGrade$$.asObservable();
  filters: LazyLoadEvent | null = null;
  processType: Application_Process = Application_Process.ConnectExamSecrets;

  appProcessType!: string;
  executionLog!: string;
  endDate: any;

  columns = [
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Koha e ekzekutimit' },
    { field: 'startTimeToShow', header: 'Koha e fillimit' },
    { field: 'endTimeToShow', header: 'Koha e mbarimit' },
  ];

  constructor(
    private readonly calculateGradesService: CalculationProcessesApiService,
    private readonly toastService: GlobalToastService
  ) {}

  getProcessData($event: LazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.calculateGradesService
      .loadProcessData(processType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = this.formatPayload(response.data);
        this.calculateGrade$$.next(dataArray);
      });
  }

  postProcess() {
    this.calculateGradesService
      .loadProcess(this.appProcessType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Procesi rifilloi me sukses!');
          const dataArray = this.formatPayload(response.data);
          this.calculateGrade$$.next(dataArray);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Dicka shkoi gabim');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(response.errorMessage);
        }
      });
  }

  formatPayload(data: any) {
    const dataArray = [data] as ApplicationProcess[];
    dataArray.forEach(item => {
      if (item === null) {
        this.toastService.showError('Nuk u gjet procedura e ruajtur');
      }
      this.endDate = formatDate(
        new Date(item.endTime as Date),
        'dd/MM/yyyy',
        'en'
      );
      this.endDate = formatDate(
        new Date(item.endTime as Date),
        'dd/MM/yyyy',
        'en'
      );
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      item.startTimeToShow = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()} `;
      item.endTimeToShow = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;
      this.appProcessType = item.appProcessType;
      this.executionLog = item.executionLog;
      item.executionTime = this.endDate;
    });
    return dataArray;
  }
}
