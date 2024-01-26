import { NgIf } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { GlobalSpinnerComponent, LoaderService } from '@msh/shared/util-shared';
import { GlobalSearchComponent } from '@msh/layout/feat-layout';
import { SearchBoxService } from '@msh/layout/data-access-layout';

@Component({
  selector: 'msh-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast></p-toast>
    <msh-global-search
      [searchBoxVisible]="searchBoxVisible"></msh-global-search>
  `,
  styles: [],
  standalone: true,
  imports: [
    RouterOutlet,
    GlobalSpinnerComponent,
    NgIf,
    ToastModule,
    HttpClientModule,
    GlobalSearchComponent,
  ],
})
export class AppComponent implements OnInit, AfterViewChecked {
  searchBoxVisible = false;
  constructor(
    private primengConfig: PrimeNGConfig,
    public loader: LoaderService,
    private cd: ChangeDetectorRef,
    private searchBoxService: SearchBoxService
  ) {}
  ngOnInit() {
    this.primengConfig.setTranslation({
      startsWith: 'Fillon me',
      contains: 'Përmban',
      notContains: 'Nuk përmban',
      endsWith: 'Mbaron me',
      am: 'PD',
      chooseDate: 'Data e zgjedhur',
      chooseMonth: 'Muaji i zgjedhur',
      chooseYear: 'Viti i zgjedhur',
      emptySearchMessage: 'Kërko',
      emptySelectionMessage: '',
      nextDecade: 'Dekada tjetër',
      nextHour: 'Ora që vjen',
      nextMinute: 'Minuti që vjen',
      nextMonth: 'Muaji që vjen',
      nextSecond: 'Sekonda që vjen',
      nextYear: 'Viti që vjen',
      pending: 'Në proçes',
      pm: 'PD',
      prevDecade: 'Dekada e mëparshme',
      prevHour: 'Ora e mëparshme',
      prevMinute: 'Minuti e mëparshme',
      prevMonth: 'Muaji e mëparshme',
      prevSecond: 'Sekonda e mëparshme',
      prevYear: 'Viti e mëparshme',
      searchMessage: 'Kërko',
      passwordPrompt: 'Vendos fjalëkalimin',
      medium: 'Mesatar',
      strong: 'I fortë',
      weak: 'I dobët',
      selectionMessage: '',
      equals: 'E njëjtë',
      notEquals: 'Jo e njëjtë',
      dateIs: 'Data është',
      dateIsNot: 'Data nuk është',
      dateAfter: 'Data pas',
      dateBefore: 'Data para',
      matchAll: 'Përputhen të gjitha',
      matchAny: 'Përputhen me çfardo',
      apply: 'Apliko',
      clear: 'Fshi',
      addRule: 'Shto Rregull',
      removeRule: 'Hiq Rregullin',
      gt: 'Më i madh se',
      gte: 'Më i madh ose i barabartë',
      lt: 'Më i vogël se',
      lte: 'Më i vogël ose i barabartë',
    });
    this.searchBoxService.searchBoxVisible$.subscribe(isVisible => {
      this.searchBoxVisible = isVisible;
    });

    this.primengConfig.filterMatchModeOptions = {
      text: [
        FilterMatchMode.STARTS_WITH,
        FilterMatchMode.CONTAINS,
        FilterMatchMode.NOT_CONTAINS,
        FilterMatchMode.ENDS_WITH,
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
      ],
      numeric: [
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
        FilterMatchMode.LESS_THAN,
        FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        FilterMatchMode.GREATER_THAN,
        FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
      ],
      date: [
        FilterMatchMode.DATE_IS,
        FilterMatchMode.DATE_IS_NOT,
        FilterMatchMode.DATE_BEFORE,
        FilterMatchMode.DATE_AFTER,
      ],
    };
  }
  ngAfterViewChecked() {
    this.cd.detectChanges();
  }
}
