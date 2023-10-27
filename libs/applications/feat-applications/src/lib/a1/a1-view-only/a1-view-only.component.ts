import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import { A1Z } from '@msh/applications/domain-application';
import { Student } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
@UntilDestroy()
@Component({
  selector: 'msh-a1-view',
  standalone: true,
  templateUrl: './a1-view-only.component.html',
  styleUrls: ['./a1-view-only.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    RouterLink,
    SelectButtonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RippleModule,
  ],
  providers: [ConfirmationService],
})
export class A1ViewOnlyComponent implements OnInit {
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.a1 = Object.assign({}, details);
    }
  }
  id: any;
  a1: A1Z = {};
  studentData: any;
  constructor(
    private cd: ChangeDetectorRef,
    private readonly a1zService: A1ZApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.a1zService
      .getOne(this.id as string)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.a1 = response.data;
        this.studentData = `${response.data.studentStudentId}-${response.data.studentFirstName}-${response.data.studentLastName}`;
        this.cd.detectChanges();
      });
  }
  onBackButtonClick() {
    this.router.navigate(['applications/students']);
  }
}
