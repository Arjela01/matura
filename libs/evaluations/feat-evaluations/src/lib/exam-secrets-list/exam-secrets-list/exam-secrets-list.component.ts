import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {ExamSecretList} from "@msh/evaluations/domain-evaluations";
import {GridEvent} from "@msh/shared/util-shared";
import {ExamAssignment} from "@msh/shared/domain-models";
import {TableModule} from "primeng/table";


@Component({
  selector: 'msh-exam-secrets-list',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule],
  templateUrl: './exam-secrets-list.component.html',
  styleUrls: ['./exam-secrets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsListComponent implements OnInit{
  @Input() examSecretLists: ExamSecretList[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamAssignment | ExamAssignment[]>
  >();

  @Output() lazyLoadData = new EventEmitter<any>();
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
   examSiteName!: string;

ngOnInit(){
  this.loadRows()
}
  loadRows() {
    this.lazyLoadData.emit(this.event);
  }

}



