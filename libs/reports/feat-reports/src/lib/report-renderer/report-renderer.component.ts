import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject, OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { REPORTS_APP_URL, SafePipe } from '@msh/shared/util-shared';
import RxPostmessenger from 'rx-postmessenger';
import { Subject, first, forkJoin, map, tap } from 'rxjs';
import { IframeAutoHeightDirective } from '../iframe-auto-height.directive';

@Component({
  selector: 'msh-report-renderer',
  standalone: true,
  imports: [CommonModule, IframeAutoHeightDirective, SafePipe],
  templateUrl: './report-renderer.component.html',
  styleUrls: ['./report-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportRendererComponent implements OnInit{
  @ViewChild('reportRenderer', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;
  id: string = this.route.snapshot.params['id'];
  studentId: string = this.route.snapshot.queryParams['studentId'];
  iframeUrl = '';
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
      childMessenger.notify('report', {
        userToken: token,
      });
    })
  );

  constructor(
    @Inject(REPORTS_APP_URL) readonly reports_app_url: string,
    private readonly authFacade: AuthFacade,
    private readonly route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  onIframeLoad(): void {
    this.iframeLoaded$$.next(true);
  }

  ngOnInit() {
    if (this.id && this.studentId) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&studentId=${this.studentId}`;
    } else {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}`;
    }
  }
}
