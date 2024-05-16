import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamAssignment } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RoleName } from '../../users/user-form/role-list';
import { AuthFacade } from '@msh/auth/data-access-auth';
import jwt_decode from 'jwt-decode';

@UntilDestroy()
@Component({
  selector: 'msh-list-of-students-filters',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-of-students-filters.component.html',
  styleUrls: ['./list-of-students-filters.component.scss'],
})
export class ListOfStudentsFiltersComponent implements OnChanges {
  @Input() totalRecords: number | undefined;
  @Input() administrationOffices: DropdownModel<string>[] = [];
  @Input() examDates: DropdownModel<string>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];
  @Input() showSortButton: boolean | undefined;
  @Output() formSave = new EventEmitter<ExamAssignment>();
  @Output() examDateChanged = new EventEmitter<ExamAssignment>();
  @Output() administrationOfficeChanged = new EventEmitter<ExamAssignment>();
  @Output() sort = new EventEmitter<ExamAssignment>();

  studentList: ExamAssignment = {} as ExamAssignment;
  submitted = false;
  userRole = '';

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly authFacade: AuthFacade
  ) {
    {
      this.authFacade.token$.pipe(untilDestroyed(this)).subscribe(token => {
        if (token) {
          const decodedToken: any = jwt_decode(token);
          this.userRole =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['administrationOffices'] &&
      changes['administrationOffices'].currentValue !== null &&
      changes['administrationOffices'].currentValue.length === 1
    ) {
      this.studentList.administrationOfficeId =
        changes['administrationOffices'].currentValue[0].key;
    }

    if (
      changes['examSites'] &&
      changes['examSites'].currentValue !== null &&
      changes['examSites'].currentValue.length === 1 &&
      changes['administrationOffices']?.currentValue?.length === 1
    ) {
      this.studentList.examSiteId = changes['examSites'].currentValue[0].key;
    }
  }

  onExamSiteChanged(): void {
    if (this.studentList.examSiteId) {
      this.examDateChanged.emit(Object.assign({}, this.studentList));
    }
  }
  onAdministrationOfficeChanged(): void {
    this.administrationOfficeChanged.emit(Object.assign({}, this.studentList));
  }

  onSubmit() {
    if (this.isSearchValid(this.studentList)) {
      this.formSave.emit(this.studentList);
    } else {
      this.toastService.showError(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }

  isSearchValid(searchModal: any) {
    return searchModal.examDateId && searchModal.examSiteId;
  }

  sortAssignments() {
    this.sort.emit(this.studentList);
  }

  protected readonly RoleName = RoleName;
}
