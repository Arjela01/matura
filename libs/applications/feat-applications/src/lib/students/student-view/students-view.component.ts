import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import {ExamAssignment, ExamGrade, ExamSubject, Student} from '@msh/shared/domain-models';
import { BehaviorSubject } from 'rxjs';
import {
  ExamAssignmentApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import {
  PermissionCheckService,
  PermissionEnum,
} from '@msh/auth/data-access-auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { A1ZTableRecord } from '@msh/applications/domain-application';
import { StudentDataComponent } from '../students-data/student-data.component';
import { StudentAuditGradesComponent } from '../student-grades/students-grades.component';
import { StudentsAssignmentsComponent } from '../student-assignments/students-assignments.component';
import { ExamGradeApiService } from '@msh/applications/data-access-applications';
import {StudentsSubjectsComponent} from "../student-subjects/students-subjects.component";

@UntilDestroy()
@Component({
  selector: 'msh-student-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    TabViewModule,
    RouterLink,
    StudentDataComponent,
    StudentAuditGradesComponent,
    StudentsAssignmentsComponent,
    StudentsSubjectsComponent,
  ],
  templateUrl: './students-view.component.html',
  styleUrls: ['./students-view.component.scss'],
})
export class StudentsViewComponent implements OnInit {
  private assignments$$ = new BehaviorSubject<ExamAssignment[]>([]);
  assignments$ = this.assignments$$.asObservable();

  private subjects$$ = new BehaviorSubject<ExamSubject[]>([]);
  subjects$ = this.subjects$$.asObservable();

  forms: A1ZTableRecord[] = [];
  finishedAtSameSchool = true;
  showEditButton = false;
  id = '';
  student!: Student;
  showStudent = false;

  academicYearId = 0;
  gradesMatchingYear: ExamGrade[] = [];
  gradesDifferentYear: ExamGrade[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly examGradeService: ExamGradeApiService,
    private route: ActivatedRoute,
    private readonly permissionCheckService: PermissionCheckService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.getFormType();
    this.getStudentsOverallData();
    this.getAssignmentsForStudentsById();
    this.getExamSubjectsForStudentId();
    this.getGradesForStudentsById();
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }

  navigateToForm(a1: A1ZTableRecord) {
    let routePath: string;

    if (this.showEditButton) {
      if (a1.isA1) {
        routePath = `/applications/a1/for-student/${this.student?.id}/edit/${a1.id}`;
      } else {
        routePath = `/applications/a1z/for-student/${this.student?.id}/edit/${a1.id}`;
      }
    } else {
      if (a1.isA1) {
        routePath = `/applications/a1/view/${a1.id}`;
      } else {
        routePath = `/applications/a1z/view/${a1.id}`;
      }
    }

    this.router.navigate([routePath]);
  }

  getStudentsOverallData() {
    this.studentService
      .getById(this.id)
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        this.student = { ...result.data };
        this.finishedAtSameSchool =
          this.student?.schoolFinished == '' ||
          this.student?.schoolFinished == null;
        this.cd.detectChanges();
      });
  }

  getFormType() {
    this.studentService
      .getA1A1ZByStudentId(this.id as string)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.forms = response.data ?? [];
        this.cd.detectChanges();
      });
  }

  getAssignmentsForStudentsById() {
    this.examAssignmentService
      .getAssignmentsByStudentId(this.id)
      .subscribe(res => {
        this.assignments$$.next(res.data);
        this.cd.detectChanges();
      });
  }


  getExamSubjectsForStudentId() {
    this.studentService
        .getExamSubjectsForStudentId(this.id)
        .subscribe(res => {
          this.subjects$$.next(res.data);
          this.cd.detectChanges();
        });
  }

  getGradesForStudentsById() {
    this.examGradeService.getGradesForStudentsById(this.id).subscribe(res => {
      this.splitGradesByYear(res.data);
      this.cd.detectChanges();
    });
  }

  splitGradesByYear(grades: ExamGrade[]) {
    this.gradesMatchingYear = [];
    this.gradesDifferentYear = [];
    grades.forEach(grade => {
      if (grade.academicYearIsActive) {
        this.gradesMatchingYear.push(grade);
      } else {
        this.gradesDifferentYear.push(grade);
      }
    });
  }
}
