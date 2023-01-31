import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/configurations/domain-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'manage-students-grids-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    TableModule,
  ],
  templateUrl: './manage-students-grids-dialog.component.html',
  styleUrls: ['./manage-students-grids-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
@UntilDestroy()
export class ManageStudentsGridsDialogComponent {
  filters: LazyLoadEvent | null = null;
  @ViewChild('dt', { static: true }) dt: any;
  totalRecords = 0;
  private students$$ = new BehaviorSubject<Student[]>([]);
  students$ = this.students$$.asObservable();
  loadedForTheFirstTime = true;
  constructor(
    public config: DynamicDialogConfig,
    public studentsService: StudentsApiService,
    public ref: DynamicDialogRef
  ) {}

  loadRows($event: LazyLoadEvent) {
    if (!this.loadedForTheFirstTime) {
      $event.filters = {
        ...$event.filters,
        ...this.config.data.config.filters,
      };
      this.studentsService
        .loadStudents($event)
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          this.students$$.next(response.data);
          this.totalRecords = response.total;
        });
    } else {
      // prevents the glitch when opening the dialog for the first time
      this.students$$.next(this.config.data.students);
      this.totalRecords = this.config.data.totalRecords;
      this.loadedForTheFirstTime = false;
    }
  }
  selectStudent(event: Student) {
    this.ref.close({
      student: event,
      filters: this.filters,
    });
  }
}
