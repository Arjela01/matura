import { TableModule } from 'primeng/table';
import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import {
  A1_FORMS,
  ADMINISTRATION_OFFICE_QUERY,
  CARRIED_GRADE,
  EXAM_TYPE_QUERY,
  STUDENTS,
} from './queries';
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
  queryName!: string;
  baseQuery!: string;

  hasNextPage = false;
  hasPreviousPage = false;
  pagesize = 20;
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

  ngOnInit() {
    this.queryName = this.route.snapshot.queryParams['queryName'];
    this.fetchData();
  }
  fetchData() {
    const skip = (this.currentPage - 1) * this.pagesize;
    switch (this.queryName) {
      case 'administrationOffice':
        this.baseQuery = ADMINISTRATION_OFFICE_QUERY;
        break;
      case 'examType':
        this.baseQuery = EXAM_TYPE_QUERY;
        break;
      case 'carriedGrade':
        this.baseQuery = CARRIED_GRADE;
        break;
      case 'students':
        this.baseQuery = STUDENTS;
        break;
      case 'a1Forms':
        this.baseQuery = A1_FORMS;
        break;
      default:
        this.baseQuery = '';
    }

    this.apollo
      .watchQuery<any>({
        query: gql`
          ${this.baseQuery}
        `,
        variables: {
          pagesize: this.pagesize,
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
        this.totalCount = Math.ceil(totalRecords / this.pagesize);
        this.updatePaginationArray();
      });
  }

  updatePaginationArray() {
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
