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
import {DropdownModule} from "primeng/dropdown";

@UntilDestroy()
@Component({
  selector: 'msh-a1z-view',
  standalone: true,
  templateUrl: './a1z-view-only.component.html',
  styleUrls: ['./a1z-view-only.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    ButtonModule,
    CheckboxModule,
    RouterLink,
    SelectButtonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RippleModule,
    DropdownModule
  ],
  providers: [ConfirmationService],
})
export class A1zViewOnlyComponent implements OnInit {
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.a1z = Object.assign({}, details);
    }
  }
  id: any;
  a1z: A1Z = {};
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
        this.a1z = response.data;
        this.studentData = `${response.data.studentStudentId}-${response.data.studentFirstName}-${response.data.studentLastName}`;
        this.cd.detectChanges();
      });
  }
  onBackButtonClick() {
    this.router.navigate(['applications/a1z']);
  }
}
