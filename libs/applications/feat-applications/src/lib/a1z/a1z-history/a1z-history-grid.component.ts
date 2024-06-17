import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { A1Z_FORMS } from '../query-a1z';
import { AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-a1z-history-grid',
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
  templateUrl: './a1z-history-grid.component.html',
  styleUrls: ['./a1z-history-grid.component.scss'],
  providers: [Apollo, DatePipe],
})
@UntilDestroy()
export class A1zHistoryGridComponent {
  SORT_ASC = 'ASC';
  SORT_DESC = 'DESC';

  @Input() recordId: any;
  @Input() recordData: any;

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
  }

  fetchRecordData() {
    const skip = (this.currentPage - 1) * this.pageSize;

    this.apollo
      .watchQuery<any>({
        query: gql`
          ${A1Z_FORMS}
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
          const items = response?.data['a1ZForms'].items || [];
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
