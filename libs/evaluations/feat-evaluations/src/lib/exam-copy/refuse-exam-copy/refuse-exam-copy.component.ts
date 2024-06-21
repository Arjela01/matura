import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ExamCopyApiService,
  ExamCopyRefuse,
} from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-refuse-exam-copy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './refuse-exam-copy.component.html',
  styleUrls: ['./refuse-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefuseExamCopyComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = Object.assign({}, details);
    }
  }
  applicationId = '';
  examCopy: ExamCopy = {};
  examCopyRefuse: ExamCopyRefuse = {
    applicationId: '',
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService,
    private readonly route: Router
  ) {}

  ngOnInit(): void {
    this.examCopyRefuse.applicationId = this.examCopy.applicationId ?? '';
  }

  onCancelClick() {
    this.route.navigate(['/evaluations/exam-copy/list-of-exam-copies']);
  }

  onRefuse() {
    this.examCopyService
      .refuse(this.examCopyRefuse)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage ?? 'Ndodhi një problem gjatë refuzimit'
          );
        }
        if (response.isSuccessful) {
          this.toastService.showSuccess('Refuzimi u krye me sukses');
          this.route.navigate(['/evaluations/exam-copy/list-of-exam-copies']);
        }
      });
  }
}
