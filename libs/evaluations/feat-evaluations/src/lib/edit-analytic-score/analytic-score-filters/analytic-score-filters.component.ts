import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchOptions } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'msh-analytic-score-filters',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './analytic-score-filters.component.html',
  styleUrls: ['./analytic-score-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticScoreFiltersComponent {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() examQuestionScoreList: SearchOptions = {} as SearchOptions;
  @Input() examTypeId = '';
  @Input() examVariantId = '';
  @Input() examSubjectId = '';
}
