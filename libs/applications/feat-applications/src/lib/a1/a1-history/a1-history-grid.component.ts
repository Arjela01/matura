import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { A1_FORMS } from '../query-a1';
import { Apollo, gql } from 'apollo-angular';
import { WhereBuilder } from '../../../../../../audit-logs/feat-audit-log/src/lib/audit-log-grid/query-builder';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GridEvent } from '@msh/shared/util-shared';
import { FailingStudent } from '@msh/applications/domain-application';

@Component({
  selector: 'msh-a1-history-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    TableModule,
    RouterLink,
  ],
  templateUrl: './a1-history-grid.component.html',
  styleUrls: ['./a1-history-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Apollo],
})
@UntilDestroy()
export class A1HistoryGridComponent implements OnInit {
  SORT_ASC = 'ASC';
  SORT_DESC = 'DESC';

  @Input() recordId: any;
  @Input() recordData: any;
  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  queryName = 'a1Forms';
  hasNextPage = false;
  hasPreviousPage = false;
  visiblePages: number[] = [];
  paginationArray: number[] = [];
  userData: { [userId: string]: string } = {};
  pageSize = 15;
  totalCount = 0;
  currentPage = 1;
  where: any = null;
  orderBy: any = null;

  constructor(private activatedRoute: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit(): void {
    this.fetchRecordData();
  }
  fetchRecordData(): void {
    const skip = (this.currentPage - 1) * this.pageSize;
    const query = gql`
      ${A1_FORMS}
    `;

    this.apollo
      .watchQuery<any>({
        query,
        variables: {
          pagesize: this.pageSize,
          skip: skip,
          where: this.where,
          order: this.orderBy,
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.subscribe(
        (response: any) => {
          const items = response?.data[this.queryName].items || [];
          this.recordData =
            items.find((item: { id: number }) => item.id === this.recordId) ||
            [];
          const totalRecords = response.data?.[this.queryName].totalCount || 0;
          this.totalCount = Math.ceil(totalRecords / this.pageSize);
          console.log(123, this.recordData);
        },
        error => {
          console.error('GraphQL Query Error:', error);
        }
      );
  }

  loadRows($event: TableLazyLoadEvent) {
    this.where = new WhereBuilder($event.filters).transformWhere();
    const flattenSort = $event.sortField
      ? {
          [`${$event.sortField}`]:
            $event.sortOrder === 1 ? this.SORT_ASC : this.SORT_DESC,
        }
      : {};
    const sortField = flattenSort;
    if (Object.keys(sortField).length === 0) {
      this.orderBy = { auditTimestamp: 'DESC' };
    } else {
      this.orderBy = flattenSort;
    }
    this.fetchRecordData();
  }
}
