import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import {
  CalculationProcessesApiService,
  ProcessesApiService,
} from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, tap } from 'rxjs';
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
  filters: LazyLoadEvent | null = null;
  processType: Application_Process = Application_Process.CalculateGrades;
  appProcessType!: string;
  executionLog!: string;

  columns = [
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Data e ekzekutimit' },
    { field: 'startTimeToShow', header: 'Koha e fillimit' },
    { field: 'endTimeToShow', header: 'Koha e mbarimit' },
  ];

  calculateGrade$ = this.process.calculateGrade$.pipe(
    tap(res => {
      this.appProcessType = res[0]?.appProcessType;
      this.executionLog = res[0]?.processStatus;
      return res;
    })
  );

  constructor(
    private readonly calculateGradesService: CalculationProcessesApiService,
    private readonly toastService: GlobalToastService,
    private readonly process: ProcessesApiService
  ) {}

  getProcessData($event: LazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.process.getData($event, processType);
  }

  postProcess() {
    this.process.post(this.processType);
  }
}
