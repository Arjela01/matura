import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { ProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { Application_Process } from '../grid/grid-type.enum';
import { ExamTypeApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
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
    DropdownModule,
  ],
  templateUrl: './calculate-grades.component.html',
  styleUrls: ['./calculate-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateGradesComponent implements OnInit {
  filters: TableLazyLoadEvent | null = null;
  processType: Application_Process = Application_Process.CalculateGrades;
  appProcessType!: string;
  executionLog!: string;
  examTypes: DropdownModel<number>[] = [];
  selectedExamType: number | null = null;
  isLoading = false;

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
      this.selectedExamType = res[0]?.examTypeId;
      return res;
    })
  );

  constructor(
    private readonly process: ProcessesApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.selectedExamType = null;
    this.getExamTypes();

    this.process.loadingState$
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
  }

  getProcessData($event: TableLazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.process.getData($event, processType);
  }
  onExamTypeSelect(event: any) {
    this.selectedExamType = event.value;
  }

  postProcess() {
    if (this.selectedExamType !== null) {
      this.process.post(this.processType, this.selectedExamType);
    }
  }

  getExamTypes() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examTypes = res.data));
  }
}
