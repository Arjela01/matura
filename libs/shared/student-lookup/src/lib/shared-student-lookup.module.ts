import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { SharedStudentApiService } from './services/shared-student-api.service';
import { SharedStudentLookupComponent } from './components/shared-student-lookup.component';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { AppBoolPipe } from '@msh/shared/ui-shared';

@NgModule({
  declarations: [SharedStudentLookupComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
    AppBoolPipe,
  ],
  providers: [SharedStudentApiService],
  exports: [SharedStudentLookupComponent],
})
export class SharedStudentLookupModule {}
