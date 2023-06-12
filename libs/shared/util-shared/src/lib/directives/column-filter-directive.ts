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
    }
  }
}
