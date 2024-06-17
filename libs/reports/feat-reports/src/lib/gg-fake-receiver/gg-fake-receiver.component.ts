import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EAlbaniaMessage } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { EalbaniaMessagesApiService } from '@msh/reports/data-access-reports';
import { CardModule } from 'primeng/card';

@UntilDestroy()
@Component({
  selector: 'msh-ealbania-messages-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
    CardModule,
  ],
  templateUrl: './gg-fake-receiver.component.html',
  styleUrls: ['./gg-fake-receiver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GgFakeReceiverComponent implements OnInit {
  data: string[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly ealbaniaMessagesApiService: EalbaniaMessagesApiService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.ealbaniaMessagesApiService
      .loadFakeReceiver()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.data = response;
        this.cd.markForCheck();
      });
  }
}
