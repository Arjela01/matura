import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { UntilDestroy,  } from '@ngneat/until-destroy';
import {LazyLoadEvent} from "primeng/api";

@UntilDestroy()
@Component({
  selector: 'msh-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @Output() dataEmitted = new EventEmitter<any>();
  totalRecords = 0;
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  data!: any;
  @Input() griddata!: any[];
  columns = [
    { field: 'column1', header: 'Emri i Tabelës' },
    { field: 'column2', header: 'Veprimi i kryer' },
    { field: 'column3', header: 'Statusi' },
    { field: 'column4', header: 'Koha e ekzekutimit' }

  ];

  constructor() {
    this.dataEmitted.emit(this.data);

  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
