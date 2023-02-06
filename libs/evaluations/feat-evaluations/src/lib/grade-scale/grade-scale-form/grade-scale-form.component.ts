import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'msh-grade-scale-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
  ],
  templateUrl: './grade-scale-form.component.html',
  styleUrls: ['./grade-scale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeScaleFormComponent {
  protected data: GradesScale | null = null;
  // Defined protected because it is using in HTML page
  selectedUsers: any = [];
  gradesForm: any;
  /**
   * Defined some values for Form - these values will be pre populated
   */
  values = [];
  examSubjectId: any;

  /**
   * Return user details form array
   */
  get gradeDetails(): any {
    return this.gradesForm?.get('gradeDetails') as FormArray;
  }

  /**
   *
   * @param formBuilder - Required Form builder to create angular reactive form
   * @param messageService - Message service is required to display messages (This is Prime NG message service)
   */
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private gradesScaleApiService: GradesScaleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.examSubjectId = this.route.snapshot.params['examSubjectId'];
    this.gradesForm = this.formBuilder.group({
      gradeDetails: this.formBuilder.array([]),
    });
    this.gradesScaleApiService.getScale(this.examSubjectId).subscribe({
      next: (data: any) => {
        console.log(this);
        this.populateData(data);
      },
      error: err => {},
    });
  }

  /**
   * Click on add button to add new row in prime ng table
   */
  onAdd() {
    this.gradesForm?.markAllAsTouched();
    this.gradeDetails.push(this.addControls());
  }

  /**
   * delete an existing row
   */
  onDelete() {
    if (this.selectedUsers.length < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Info',
        detail: 'Please select a record to delete!',
      });
      return;
    }
    for (var i = this.selectedUsers.length - 1; i >= 0; i--) {
      this.gradeDetails.controls.splice(this.selectedUsers[i] - 1, 1);
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Selected records deleted!',
    });

    this.selectedUsers = [];
  }

  /**
   * click on  submit button
   */
  // onSubmit() {
  //   this.data = JSON.stringify(this.usersDetails.value);
  // }

  userDetailsControls(index: number) {
    return this.gradeDetails?.controls[index]['controls'];
  }

  /**
   * Add control into Form
   */
  private addControls() {}

  /**
   * Populate data into Form
   */
  private populateData(el: any) {
    el?.data.map((data: GradesScale, index: number) => {
      this.onAdd();
      this.gradeDetails.controls[index].setValue({
        id: data.id,
        examSubjectId: data.examSubjectId,
        grade: data.grade,
        score: data.score,
      });
    });
  }
}
