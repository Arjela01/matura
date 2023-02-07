import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {GridComponent} from '../grid/grid.component';
import {GenerateGradeApiService} from '@msh/evaluations/data-access-evaluations';
import {LazyLoadEvent} from 'primeng/api';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject} from 'rxjs';
import {GenerateGrade} from '@msh/evaluations/domain-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-generate-grades',
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
  templateUrl: './generate-grades.component.html',
  styleUrls: ['./generate-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateGradesComponent {
  data!: any[];
  gridData = [
    {
      column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
    },
  ];
  appProcessType !:string;
  executionLog = 'Sukses';
  private generateGrade$$ = new BehaviorSubject<GenerateGrade[]>([]);
  generateGrade$ = this.generateGrade$$.asObservable();
  filters: LazyLoadEvent | null = null;

  // isSuccessful = true

  constructor(
    private readonly generateGradesService: GenerateGradeApiService
  ) {
  }

  getGeneratedGrades($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.generateGradesService
      .loadGeneratedGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = [{
          appProcessType: "CalculateGrades",
          processStatus: "Ended",
          startTime: "2023-02-06T22:07:44.5351935+01:00",
          endTime: "2023-02-06T22:07:45.2751112+01:00",
          errorMessage: "Could not find stored procedure 'CalculateGrade'.",
          executionLog: "Procesi i perllogaritjes se notave deshtoi.",
          id: 20
        }, {
          appProcessType: "CalculateGrades",
          processStatus: "Ended",
          startTime: "2023-02-06T22:07:44.5351935+01:00",
          endTime: "2023-02-06T22:07:45.2751112+01:00",
          errorMessage: "Could not find stored procedure 'CalculateGrade'.",
          executionLog: "Procesi i perllogaritjes se notave deshtoi.",
          id: 10
        },
          {
            appProcessType: "CalculateGrades",
            processStatus: "Ended",
            startTime: "2023-02-06T22:07:44.5351935+01:00",
            endTime: "2023-02-06T22:07:45.2751112+01:00",
            errorMessage: "Could not find stored procedure 'CalculateGrade'.",
            executionLog: "Procesi i perllogaritjes se notave deshtoi.",
            id: 14
          }]
        this.generateGrade$$.next(dataArray as never);
        this.appProcessType = dataArray[0].appProcessType
        // this.isSuccessful = response.isSuccessful;
        console.log(88888, dataArray)
      });
  }

  onDataEmitted(data: any) {
    console.log(data);
  }
}
