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
  studentObj: { value: string | number; key: string } | null = this.findStudentID(this.route.snapshot.queryParams);
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

   findStudentID(obj :{[x : string]:string | number } ){
    const key = Object.keys(obj).find(k => k.toLowerCase() === 'studentid');
    if (key) {
      return { key: key, value: obj[key] };
    }
    return null;
  }

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
    if (this.id && this.studentObj) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&${this.studentObj.key}=${this.studentObj.value}`;
    } else {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}`;
    }
  }
}
