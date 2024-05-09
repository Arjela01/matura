import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ExamAssignment, ExamGrade, Student } from '@msh/shared/domain-models';
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
  ],
  templateUrl: './students-view.component.html',
  styleUrls: ['./students-view.component.scss'],
})
export class StudentsViewComponent implements OnInit {
  private assignments$$ = new BehaviorSubject<ExamAssignment[]>([]);
  assignments$ = this.assignments$$.asObservable();
  private grades$$ = new BehaviorSubject<ExamGrade[]>([]);
  grades$ = this.grades$$.asObservable();

  forms: A1ZTableRecord[] = [];
  finishedAtSameSchool = true;
  showEditButton = false;
  id = '';
  academicYearId = 0;
  student!: Student;
  showStudent = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private route: ActivatedRoute,
    private readonly permissionCheckService: PermissionCheckService,
    private readonly examAssignmentService: ExamAssignmentApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      this.academicYearId = academicYear.id;
    }
  }

  ngOnInit(): void {
    this.getFormType();
    this.getStudentsOverallData();
    this.getAssignmentsForStudentsByNid();
    this.getGradesForStudentsById();
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
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

  getAssignmentsForStudentsByNid() {
    this.examAssignmentService
      .getAssignmentsForStudentsByNid(this.id, this.academicYearId)
      .subscribe(res => {
        this.assignments$$.next(res.data);
        this.cd.detectChanges();
      });
  }

  getGradesForStudentsById() {
    this.studentService
      .getGradesForStudentsById(this.id, this.academicYearId)
      .subscribe(res => {
        this.grades$$.next(res.data);
        this.cd.detectChanges();
      });
  }
}
