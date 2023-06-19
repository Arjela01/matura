import { Directive, Host, Optional, Self, TemplateRef, ViewContainerRef } from '@angular/core';
import { ColumnFilter } from 'primeng/table';

@Directive({
  selector: '[mshColumnFilterDirective]',
  standalone: true,
})
export class ColumnFilterDirective {
  constructor(
    @Host() @Self() @Optional() private filter: ColumnFilter,
    @Optional() private templateRef: TemplateRef<any>,
    @Optional() private viewContainerRef: ViewContainerRef
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
      let filterValue : any
      filterValue ? filterValue.toString().toLowerCase() : null;
      originalApplyFilter.call(filter);
    };

    filter.matchMode = 'contains';
  }
}
