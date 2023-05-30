import { TableModule } from 'primeng/table';
import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { queriesMap } from './queries';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'msh-audit-log-grid',
  standalone: true,
  imports: [CommonModule, TableModule, RippleModule, ButtonModule],
  templateUrl: './audit-log-grid.component.html',
  styleUrls: ['./audit-log-grid.component.scss'],
  providers: [Apollo],
})
export class AuditLogGridComponent implements OnInit {
  data: any[] = [];
  queryName!: any;
  baseQuery!: string;
  visiblePages: number[] = [];

  hasNextPage = false;
  hasPreviousPage = false;
  pageSize = 20;
  totalCount = 0;
  indexHeader = 0;
  currentPage = 1;
  paginationArray: number[] = [];

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
  goToFirstPage(){
    this.currentPage = 1;
    this.fetchData();
  }
  ngOnInit() {
    this.queryName = this.route.snapshot.queryParams['queryName'];
    this.fetchData();
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
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.data =
          this.flattenObjectArray(result?.data[this.queryName].items) || [];
        this.indexHeader = this.findIndexOfMostFields(this.data);
        this.queryName = Object.keys(result.data || {})[0];
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

  flattenObject(obj: any, parentKey = ''): any {
    const flattened: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        const nestedFlattened = this.flattenObject(value, newKey);
        Object.assign(flattened, nestedFlattened);
      } else {
        flattened[newKey] = value;
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
}
