import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FailingStudent } from '@msh/applications/domain-application';
import { AppDatePipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective, GridEvent, USERS } from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Apollo, gql } from 'apollo-angular';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-user-history',
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
    ColumnFilterDirective,
    DatePipe,
    AppDatePipe,
  ],
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  providers: [Apollo, DatePipe],
})
@UntilDestroy()
export class UserHistoryComponent {
  SORT_ASC = 'ASC';
  SORT_DESC = 'DESC';

  @Input() recordId: any;
  @Input() recordData: any;
  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  queryName = 'user';
  pageSize = 50;
  totalCount = 0;
  currentPage = 1;
  where: any = null;
  orderBy: any = null;

  constructor(
    private apollo: Apollo,
    private cd: ChangeDetectorRef
  ) {}

  loadRows($event: TableLazyLoadEvent) {
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
    this.cd.markForCheck();
  }

  fetchRecordData() {
    const skip = (this.currentPage - 1) * this.pageSize;

    this.apollo
      .watchQuery<any>({
        query: gql`
          ${USERS}
        `,
        variables: {
          pagesize: this.pageSize,
          skip: skip,
          where: {
            ...this.where,
            parentRecord: { id: { eq: this.recordId } },
          },
          order: this.orderBy,
        },
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.subscribe(
        (response: any) => {
          const items = response?.data[this.queryName].items || [];
          this.recordData = items;
          this.totalCount = this.recordData.length;
          this.cd.markForCheck();
        },
        error => {
          console.error('GraphQL Query Error:', error);
        }
      );
  }
}
