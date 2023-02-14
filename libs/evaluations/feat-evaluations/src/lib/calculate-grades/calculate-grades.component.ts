import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { CalculateGradeApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { CalculateGrade } from '@msh/evaluations/domain-evaluations';

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
  private calculateGrade$$ = new BehaviorSubject<CalculateGrade[]>([]);
  calculateGrade$ = this.calculateGrade$$.asObservable();
  filters: LazyLoadEvent | null = null;

  appProcessType!: string;
  executionLog!: string;
  endTime: any;

  columns = [
    { field: 'executionLog', header: 'Veprimi i kryer' },
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Koha e ekzekutimit' },
  ];

  constructor(
    private readonly calculateGradesService: CalculateGradeApiService
  ) {}

  getCalculatedGrades($event: LazyLoadEvent) {
    this.filters = { ...$event };

    this.calculateGradesService
      .loadCalculatedGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = [response.data] as CalculateGrade[];
        if (dataArray.length > 0) {
          dataArray.forEach(item => {
            this.endTime = formatDate(
              new Date(item.endTime as Date),
              'dd/MM/yyyy',
              'en'
            );
            const differenceInMs =
              new Date(item.endTime).getTime() -
              new Date(item.startTime).getTime();
            const duration = new Date(differenceInMs)
              .toISOString()
              //extract only the first 8 characters starting from the 11th position
              .substr(11, 8);
            item.executionTime = `${this.endTime} ${duration}`;
            this.appProcessType = item.appProcessType;
            this.executionLog = item.executionLog;
          });
        }
        this.calculateGrade$$.next(dataArray);
      });
  }
}
