import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[iframeAutoHeight]',
  standalone: true,
})
export class IframeAutoHeightDirective {
  @HostListener('load', ['$event'])
  handeIframeLoad(event: any) {
    this.setHeight(event.target?.ownerDocument?.body?.offsetHeight);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  private setHeight(height: number) {
    let customHeight = height;
    if (!customHeight || customHeight <= 0) customHeight = 500;

    setTimeout(() => {
      const iframe = this.el.nativeElement as HTMLIFrameElement;
      this.renderer.setStyle(iframe, 'height', `${height}px`);
      return false;
    }, 100);
  }
}
