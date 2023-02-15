import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { CalculationProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { ApplicationProcess } from '@msh/evaluations/domain-evaluations';
import { Application_Process } from '../grid/grid-type.enum';
import { GlobalToastService } from '@msh/shared/util-shared';

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
  templateUrl: './calculate-grades.component.html',
  styleUrls: ['./calculate-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateGradesComponent {
  private calculateGrade$$ = new BehaviorSubject<ApplicationProcess[]>([]);
  calculateGrade$ = this.calculateGrade$$.asObservable();
  filters: LazyLoadEvent | null = null;
  processType: Application_Process = Application_Process.CalculateGrades;
  appProcessType!: string;
  executionLog!: string;
  endTime: any;

  columns = [
    { field: 'executionLog', header: 'Veprimi i kryer' },
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Koha e ekzekutimit' },
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
        console.log('step1', dataArray);
        this.calculateGrade$$.next(dataArray);
      });
  }

  postProcess() {
    this.calculateGradesService
      .loadProcess(this.appProcessType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = this.formatPayload(response.data);
        this.calculateGrade$$.next(dataArray);
      });
  }

  formatPayload(data: any) {
    const dataArray = [data] as ApplicationProcess[];
    if (dataArray.length > 0) {
      dataArray.forEach(item => {
        if (item === null) {
          this.toastService.showError('Nuk u gjet procedura e ruajtur');
        }
        this.endTime = formatDate(
          new Date(item.endTime as Date),
          'dd/MM/yyyy',
          'en'
        );
        const differenceInMs =
          new Date(item.endTime).getTime() - new Date(item.startTime).getTime();
        const duration = new Date(differenceInMs).toISOString().substr(11, 8);
        item.executionTime = `${this.endTime} ${duration}`;
        this.appProcessType = item.appProcessType;
        this.executionLog = item.executionLog;
      });
    }
    return dataArray;
  }
}
