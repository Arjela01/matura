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
import {PaginatorModule} from "primeng/paginator";


@Component({
  selector: 'msh-exam-secrets-list',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule, PaginatorModule],
  templateUrl: './exam-secrets-list.component.html',
  styleUrls: ['./exam-secrets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsListComponent implements OnInit{
  @Input() examSecretLists: ExamSecretList[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() changePage = new EventEmitter();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamAssignment | ExamAssignment[]>
  >();

  @Output() lazyLoadData = new EventEmitter<any>();
  currentPage = 1;

  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  pageSize = 100;

ngOnInit(){
  this.loadRows()
}

  loadRows() {
    this.lazyLoadData.emit(this.event);
  }
  updatePage(pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.changePage.emit((pageNumber - 1) * this.pageSize);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.updatePage(this.currentPage);
  }
}



