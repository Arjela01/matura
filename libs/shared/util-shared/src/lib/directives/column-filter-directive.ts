import {
  Directive,
  ElementRef,
  Host,
  HostListener,
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

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    const menuItemSelector = 'span.layout-menuitem-text.ng-tns-c106-25';

    if (
      !this.elementRef.nativeElement.contains(targetElement) &&
      targetElement.matches(menuItemSelector)
    ) {
      event.stopPropagation();
      this.clearFilter();
    }
  }

  private setMatchModeToContains(filter: ColumnFilter): void {
    const originalApplyFilter = filter.applyFilter;
    filter.applyFilter = (): void => {
      let filterValue: any;
      filterValue ? filterValue.toString().toLowerCase() : null;
      originalApplyFilter.call(filter);
    };

    filter.matchMode = 'contains';
  }

  private clearFilter(): void {
    if (this.filter) {
      this.filter.clearFilter();
    }
  }
}
