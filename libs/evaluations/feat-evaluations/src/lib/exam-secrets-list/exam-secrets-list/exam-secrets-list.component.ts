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
import {ExamSecret, ExamSecretList} from "@msh/evaluations/domain-evaluations";
import {GlobalToastService, GridEvent} from "@msh/shared/util-shared";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ExamSecretApiService} from "@msh/evaluations/data-access-evaluations";

@UntilDestroy()

@Component({
  selector: 'msh-exam-secrets-list',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './exam-secrets-list.component.html',
  styleUrls: ['./exam-secrets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsListComponent implements OnInit{
  @Input() examSecretForm: ExamSecretList[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() changePage = new EventEmitter();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();

  @Output() lazyLoadData = new EventEmitter<any>();
  currentPage = 1;

  event = {
    first: 0,
    rows: 100,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  pageSize = 1000;
   barcodeValue: any;

  constructor(
    private readonly examSecretService: ExamSecretApiService,
    private readonly toastService: GlobalToastService,

  ){}


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


  update(examSecret: ExamSecret) {
    this.examSecretService
      .save(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(2222,examSecret)
        if (response.isSuccessful) {
          this.toastService.showSuccess('Barkodi u shtua me sukses!');
          // this.getExamSecrets(this.filters as LazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të barkodit!'
          );
        }
      });  }

  onFocusOutEvent(row: any) {
      const examSecret: ExamSecret = {id: row.studentId, barcode: row?.barcode};
      this.update(examSecret);

  }

}



