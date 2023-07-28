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
import {BehaviorSubject, forkJoin} from "rxjs";
import { ExamSecretList} from "@msh/evaluations/domain-evaluations";
import {ExamSecretApiService} from "@msh/evaluations/data-access-evaluations";


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
  private examSecretsFilterForm$$ = new BehaviorSubject<any[]>([]);
  examSecretsFilterForm$ = this.examSecretsFilterForm$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;
  event = {
    first: 0,
    rows: 1000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
   selectedExamSecretList: ExamSecretList;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly examSecretService: ExamSecretApiService,
    private readonly cd: ChangeDetectorRef
  ) {  this.selectedExamSecretList = {} as ExamSecretList;
  }

  onFormSave(event: any) {
    this.selectedExamSecretList = event
    this.search();
  }


  getExamSecretsList($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    const examAssignments$ = this.examAssignmentService.loadExamAssignments($event);
    const examSecrets$ = this.examSecretService.loadExamSecrets($event);

    forkJoin([examAssignments$, examSecrets$])
      .pipe(untilDestroyed(this))
      .subscribe(([examAssignmentsResponse, examSecretsResponse]) => {
        this.examSecretsFilterForm$$.next(examAssignmentsResponse.data);
        this.totalRecords = examAssignmentsResponse.total;
        examSecretsResponse.data.map(el => el.hasBarcode = true)

        this.examSecretsFilterForm$$.next([...this.examSecretsFilterForm$$.getValue(), ...examSecretsResponse.data]);
        this.totalRecords += examSecretsResponse.total;
        console.log(222,examAssignmentsResponse.data)
        console.log(222,examSecretsResponse.data)

      });
  }


  search(){
    this.event.filters = {
      examSiteName: [
        {
          value: this.selectedExamSecretList.examSiteName,
          matchMode: 'contains',
          operator: 'and',
        }],
      administrationOfficeName: [
        {
          value: this.selectedExamSecretList.administrationOfficeName,
          matchMode: 'contains',
          operator: 'and',
        }],
      examTypeName:[
        {
          value: this.selectedExamSecretList.examTypeName,
          matchMode: 'contains',
          operator: 'and',
        }],
        examTypeDateTime: [
        {
          value: this.selectedExamSecretList.examTypeDateTime,
          matchMode: 'contains',
          operator: 'and',
        }],
       examSubjectName:[
        {
          value: this.selectedExamSecretList.examSubjectName,
          matchMode: 'contains',
          operator: 'and',
        }],
      hasBarcode:[
        {
          value: this.selectedExamSecretList.hasBarcode,
          matchMode: 'equals',
          operator: 'and',
        }],
      isFall:[
        {
          value: this.selectedExamSecretList.isFall,
          matchMode: 'equals',
          operator: 'and',
        }],

    };
      this.getExamSecretsList(this.event)

  }


}
