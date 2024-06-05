import {
  Directive,
  ElementRef,
  Host,
  Optional,
  Renderer2,
} from '@angular/core';
import { ColumnFilter } from 'primeng/table';

@Directive({
  selector: '[mshColumnFilterDirective]',
  standalone: true,
})
export class ColumnFilterDirective {
  constructor(
    @Host() @Optional() private filter: ColumnFilter,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    if (filter) {
      filter.hide = (): void => {
        filter.overlayVisible = false;
        filter.dt.cd.markForCheck();
      };

      this.setMatchModeToContains(filter);
    }
  }
  private setMatchModeToContains(filter: ColumnFilter): void {
    const originalApplyFilter = filter.applyFilter;
    filter.applyFilter = (): void => {
      let filterValue: any;
      filterValue ? filterValue.toString().toLowerCase() : null;
      originalApplyFilter.call(filter);
    };

    if (filter.type === 'text') {
      filter.matchMode = 'contains';
    }
  }
}
