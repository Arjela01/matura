import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RouterLink } from '@angular/router';
import {
  ColumnFilterDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { ExamSecret, ExamSecretLock } from '@msh/shared/domain-models';
import { ExamSecretLockApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppBoolPipe } from '@msh/shared/ui-shared';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secret-lock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    RouterLink,
    ColumnFilterDirective,
    InputSwitchModule,
    AppBoolPipe,
  ],
  templateUrl: './exam-secret-lock.component.html',
  styleUrls: ['./exam-secret-lock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretLockComponent implements OnInit {
  private examSecret$$ = new BehaviorSubject<ExamSecretLock[]>([]);
  examSecret$ = this.examSecret$$.asObservable();

  constructor(
    private readonly examSecretLockService: ExamSecretLockApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.getExamSecretLocks();
  }

  getExamSecretLocks() {
    this.examSecretLockService
      .loadExamSecretLocksData()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.examSecret$$.next(res.data);
      });
  }
  onToggleExamSecretLock(examSecretLock: ExamSecretLock) {
    this.examSecretLockService
      .save(examSecretLock)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Ndryshimi  u krye me sukses!');
          this.getExamSecretLocks();
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Ndodhi një problem!');
        }
      });
  }
}
