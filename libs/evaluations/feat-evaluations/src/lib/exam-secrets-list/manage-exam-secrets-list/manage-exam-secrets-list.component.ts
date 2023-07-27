import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {ExamSecretsListComponent} from "../exam-secrets-list/exam-secrets-list.component";
import {ExamSecretsSearchFormComponent} from "../exam-secrets-search-form/exam-secrets-search-form.component";
import {ExamSecretsFormComponent} from "../../exam-secrets/exam-secrets-form/exam-secrets-form.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {GlobalToastService} from "@msh/shared/util-shared";
import {ExamAssignmentApiService} from "@msh/configurations/data-access-configurations";
import {ExamSecretsGridComponent} from "../../exam-secrets/exam-secrets-grid/exam-secrets-grid.component";
import {BehaviorSubject} from "rxjs";
import {ExamSecretList} from "@msh/evaluations/domain-evaluations";


@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-secrets-list',
  standalone: true,
  imports: [CommonModule, DropdownModule, ExamSecretsListComponent, ExamSecretsSearchFormComponent, ExamSecretsFormComponent, ExamSecretsGridComponent],
  templateUrl: './manage-exam-secrets-list.component.html',
  styleUrls: ['./manage-exam-secrets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageExamSecretsListComponent {
  private examSecretsList$$ = new BehaviorSubject<any[]>([]);
  examSecretsList$ = this.examSecretsList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
   selectedExamSecretList: ExamSecretList;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly cd: ChangeDetectorRef
  ) {  this.selectedExamSecretList = {} as ExamSecretList;
  }

  onFormSave(event: any) {
    this.selectedExamSecretList = event
    this.search();
  }

  getExamSecretsList($event: LazyLoadEvent){
    this.filters = Object.assign({}, $event);
    this.examAssignmentService
      .loadExamAssignments($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretsList$$.next(response.data);

        this.totalRecords = response.total;
        console.log(2222,response.data)
      });
  }


  search(){
    this.event.filters = {
      examSiteName: [
        {
          value: this.selectedExamSecretList.examSiteName,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.administrationOfficeName,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.examTypeName,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.examTypeDateTime,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.examSubjectName,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.barcode,
          matchMode: 'contains',
          operator: 'and',
        },
        {
          value: this.selectedExamSecretList.isFall,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
    };
      this.event.first = 0;
      this.examAssignmentService
        .loadExamAssignments(this.event)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.examSecretsList$$.next(response.data);
          this.totalRecords = response.data.length;
        });

  }

}
