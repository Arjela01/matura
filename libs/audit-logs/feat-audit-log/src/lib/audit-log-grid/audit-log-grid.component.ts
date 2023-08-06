import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import { Apollo, gql } from 'apollo-angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { queriesMap } from './queries';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { WhereBuilder } from './query-builder';
import { TranslationPipe } from './translate-pipe';
import { TranslationService } from '@msh/audit-logs/data-access-audit-log';
import {ColumnFilterDirective} from "@msh/shared/util-shared";

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';
@Component({
  selector: 'msh-audit-log-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    RippleModule,
    ButtonModule,
    FormsModule,
    TranslationPipe,
    ColumnFilterDirective,
  ],
  templateUrl: './audit-log-grid.component.html',
  styleUrls: ['./audit-log-grid.component.scss'],
  providers: [Apollo, TranslationService],
})
export class AuditLogGridComponent implements OnInit {
  data: any[] = [];
  queryName!: any;
  baseQuery!: string;
  usersQuery!: string;

  visiblePages: number[] = [];
  matchModeOptions!: SelectItem[];
  hasNextPage = false;
  hasPreviousPage = false;
  pageSize = 15;
  totalCount = 0;
  indexHeader = 0;
  currentPage = 1;
  paginationArray: number[] = [];
  where: any = null;
  orderBy: any = null;
  filterValues: { [key: string]: any } = {};
  defaultDataCol: any[] = [];
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  userData: { [userId: string]: string } = {};

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  goNext() {
    this.currentPage++;
    this.fetchData();
  }
  goBack() {
    this.currentPage--;
    this.fetchData();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchData();
  }
  goToLastPage() {
    this.currentPage = this.totalCount;
    this.fetchData();
  }
  goToFirstPage() {
    this.currentPage = 1;
    this.fetchData();
  }

  ngOnInit() {
    this.queryName = this.route.snapshot.queryParams['queryName'];
  }
  fetchData() {
    const skip = (this.currentPage - 1) * this.pageSize;

    this.baseQuery = queriesMap.get(this.queryName) || '';
    if (this.baseQuery === '') {
      return;
    }
    this.apollo
      .watchQuery<any>({
        query: gql`
          ${this.baseQuery}
        `,
        variables: {
          pagesize: this.pageSize,
          skip: skip,
          where: this.where,
          order: this.orderBy,
        },
        fetchPolicy: 'cache-and-network',
      })

      .valueChanges.subscribe((result: any) => {
        this.data =
          this.flattenObjectArray(result?.data[this.queryName].items) || [];
        this.indexHeader = this.findIndexOfMostFields(this.data) || 0;
        if (this.data.length) this.defaultDataCol = this.data[this.indexHeader];
        this.queryName = Object.keys(result.data || {})[0] || '';
        this.hasPreviousPage =
          result.data?.[this.queryName].pageInfo?.hasPreviousPage;
        this.hasNextPage = result.data?.[this.queryName].pageInfo?.hasNextPage;
        const totalRecords = result.data?.[this.queryName].totalCount || 0;
        this.totalCount = Math.ceil(totalRecords / this.pageSize);
        this.updatePaginationArray();
      });
  }

  updatePaginationArray() {
    const totalVisibleLinks = 5;
    const halfVisibleLinks = Math.floor(totalVisibleLinks / 2);
    const startPage = Math.max(this.currentPage - halfVisibleLinks, 1);
    const endPage = Math.min(
      startPage + totalVisibleLinks - 1,
      this.totalCount
    );

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    this.paginationArray = Array.from(
      { length: this.totalCount },
      (_, i) => i + 1
    );
  }

  flattenObjectArray(arr: any[]): any[] {
    return arr.map(obj => this.flattenObject(obj));
  }
  isDateStringValid(dateString: string): boolean {
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;
    return dateRegex.test(dateString);
  }

  formatDateString(dateString: string): string {
    if (!this.isDateStringValid(dateString)) {
      throw new Error('Invalid date string format');
    }

    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').split('.')[0];
  }
  flattenObject(obj: any, parentKey = ''): any {
    const flattened: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (key !== '__typename') {
        if (typeof value === 'object' && value !== null) {
          const nestedFlattened = this.flattenObject(value, newKey);
          Object.assign(flattened, nestedFlattened);
        } else if (this.isGuid(value as string)) {
          flattened[newKey] = this.userData[value as string] || value;
        } else if (typeof value === 'string' && this.isDateStringValid(value)) {
          const formattedValue = this.formatDateString(value);
          flattened[newKey] = formattedValue;
        } else {
          flattened[newKey] = value;
        }
      }
    }

    return flattened;
  }

  findIndexOfMostFields(arr: any[]) {
    let maxFieldCount = -1;
    let maxFieldIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      const fieldCount = Object.keys(obj).length;

      if (fieldCount > maxFieldCount) {
        maxFieldCount = fieldCount;
        maxFieldIndex = i;
      }
    }

    return maxFieldIndex;
  }

  loadRows($event: TableLazyLoadEvent) {
    this.where = new WhereBuilder($event.filters).transformWhere();
    const flattenSort = $event.sortField
      ? {
          [`${$event.sortField}`]:
            $event.sortOrder === 1 ? SORT_ASC : SORT_DESC,
        }
      : {};
    const sortField = this.unflatten(flattenSort);
    if (Object.keys(sortField).length === 0) {
      this.orderBy = { auditTimestamp: 'DESC' };
    } else {
      this.orderBy = this.unflatten(flattenSort);
    }
    this.fetchData();
  }

  unflatten(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];
      const keyParts = key.split('.');
      let currentObj: Record<string, any> = result;

      for (let i = 0; i < keyParts.length; i++) {
        const part = keyParts[i];

        if (!currentObj[part]) {
          if (i === keyParts.length - 1) {
            currentObj[part] = value;
          } else {
            currentObj[part] = {};
          }
        }
        currentObj = currentObj[part];
      }
    }

    return result;
  }
  isGuid(str: string): boolean {
    const guidRegex =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    return guidRegex.test(str);
  }

  findType(key: any): string {
    let type = typeof key;
    if (this.isGuid(key)) type = 'bigint';
    switch (type) {
      case 'number':
        return 'numeric';
      case 'boolean':
        return 'boolean';
      default:
        return 'text';
    }
  }
  findDefaultMode(key: any): string {
    let type = typeof key;
    if (this.isGuid(key)) type = 'bigint';
    switch (type) {
      case 'number':
      case 'bigint':
      case 'boolean':
        return 'equals';
      default:
        return 'contains';
    }
  }
  findMatchModeOptions(key: any) {
    let type = typeof key;
    if (this.isGuid(key)) type = 'bigint';
    switch (type) {
      case 'number':
      case 'bigint':
      case 'boolean':
        return [
          { label: 'E barabartë', value: 'equals' },
          { label: 'Jo e barabartë', value: 'notEquals' },
        ];
      default:
        return [
          { label: 'Përmban', value: 'contains' },
          { label: 'Nuk përmban', value: 'ncontains' },
          { label: 'Fillon me', value: 'startsWith' },
          { label: 'Mbaron me', value: 'endsWith' },
        ];
    }
  }
}
