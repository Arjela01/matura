import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentAuditDataComponent } from '../student-audit-data/student-audit-data.component';
import { TabViewModule } from 'primeng/tabview';
import { StudentsAuditService } from '@msh/audit-logs/data-access-audit-log';
import { ExamGrade, Student } from '@msh/shared/domain-models';
import { StudentAuditGradesComponent } from '../student-audit-grades/student-audit-grades.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'msh-manage-student-audit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    TabViewModule,
    RouterLink,
    StudentAuditDataComponent,
    StudentAuditGradesComponent,
  ],
  templateUrl: './manage-student-audit.component.html',
  styleUrls: ['./manage-student-audit.component.scss'],
})
export class ManageStudentAuditComponent implements OnInit {
  private grades$$ = new BehaviorSubject<ExamGrade[]>([]);
  grades$ = this.grades$$.asObservable();

  id = '';
  finishedAtSameSchool = true;
  student!: Student;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly studentAuditService: StudentsAuditService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit() {
    this.getStudentDataByNid();
    this.getStudentGradesByNid();
  }

  getStudentDataByNid() {
    this.studentAuditService.getStudentsById(this.id).subscribe(res => {
      this.student = res.data;
      this.finishedAtSameSchool =
        this.student?.schoolFinished == '' ||
        this.student?.schoolFinished == null;
      this.cd.detectChanges();
    });
  }

  getStudentGradesByNid() {
    this.studentAuditService.getStudentsGradesByNid(this.id).subscribe(res => {
      this.grades$$.next(res.data);
      this.cd.detectChanges();
    });
  }
}
