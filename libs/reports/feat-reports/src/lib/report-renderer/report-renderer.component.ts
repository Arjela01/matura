import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { REPORTS_APP_URL } from '@msh/shared/util-shared';
import RxPostmessenger from 'rx-postmessenger';
import { first, forkJoin, map, Subject, tap } from 'rxjs';
import { IframeAutoHeightDirective } from '../iframe-auto-height.directive';

@Component({
  selector: 'msh-report-renderer',
  standalone: true,
  imports: [CommonModule, IframeAutoHeightDirective],
  templateUrl: './report-renderer.component.html',
  styleUrls: ['./report-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportRendererComponent {
  @ViewChild('reportRenderer', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;

  private readonly iframeLoaded$$ = new Subject<boolean>();
  private readonly iframeLoaded$ = this.iframeLoaded$$
    .asObservable()
    .pipe(first());
  private readonly userToken$ = this.authFacade.token$.pipe(first());

  sendMessage$ = forkJoin([this.iframeLoaded$, this.userToken$]).pipe(
    map(([_, token]: [boolean, string]) => token),
    tap(token => {
      const childMessenger = RxPostmessenger.connect(
        this.iframe.nativeElement.contentWindow as Window,
        this.reports_app_url
      );

      //TODO: Replace with a real report id
      childMessenger.notify('report', {
        reportId: '1',
        userToken: token,
      });
    })
  );

  constructor(
    @Inject(REPORTS_APP_URL) private readonly reports_app_url: string,
    private authFacade: AuthFacade
  ) {}

  onIframeLoad(): void {
    this.iframeLoaded$$.next(true);
  }
}
