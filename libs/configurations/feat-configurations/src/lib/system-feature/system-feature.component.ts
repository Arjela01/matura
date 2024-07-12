import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RouterLink } from '@angular/router';
import {
  ColumnFilterDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { SystemFeatureModel } from '@msh/shared/domain-models';
import { SystemFeatService } from '@msh/configurations/data-access-configurations';

@UntilDestroy()
@Component({
  selector: 'msh-system-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    RouterLink,
    ColumnFilterDirective,
    InputSwitchModule,
    AppBoolPipe,
    AppDatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './system-feature.component.html',
  styleUrls: ['./system-feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemFeatureComponent implements OnInit {
  private features$$ = new BehaviorSubject<SystemFeatureModel[]>([]);
  features$ = this.features$$.asObservable();

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly systemFeatService: SystemFeatService
  ) {}

  ngOnInit() {
    this.getSystemFeatures();
  }

  getSystemFeatures() {
    this.systemFeatService
      .loadFeatures()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        const formattedFeatures = res.data.map(feature => ({
          ...feature,
          availableFrom:
            feature.availableFrom && feature.isAvailable === true
              ? new Date(feature.availableFrom)
              : null,
          availableTo:
            feature.availableTo && feature.isAvailable === true
              ? new Date(feature.availableTo)
              : null,
        }));
        this.features$$.next(formattedFeatures as any);
      });
  }

  saveChanges(systemFeat: SystemFeatureModel) {
    const updatedFeat: SystemFeatureModel = {
      ...systemFeat,
      availableFrom: systemFeat.availableFrom
        ? this.convertDateToUTCString(systemFeat.availableFrom)
        : null,
      availableTo: systemFeat.availableTo
        ? this.convertDateToUTCString(systemFeat.availableTo)
        : null,
    };

    this.systemFeatService
      .update(updatedFeat)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Ndryshimi u krye me sukses!');
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Ndodhi një problem!');
        }
      });
  }

  convertDateToUTCString(date: Date): string {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ).toISOString();
  }
}
