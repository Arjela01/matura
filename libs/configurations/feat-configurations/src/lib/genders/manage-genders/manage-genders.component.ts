import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenderStore } from '@msh/configurations/data-access-configurations';
import { Gender } from '@msh/configurations/domain-configurations';
import { GlobalToastService, GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { GenderFormComponent } from './../gender-form/gender-form.component';
import { GenderGridComponent } from './../gender-grid/gender-grid.component';


@Component({
  selector: 'msh-manage-genders',
  standalone: true,
  imports: [ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    GenderFormComponent,
    GenderGridComponent,
    ToolbarModule],
  templateUrl: './manage-genders.component.html',
  styleUrls: ['./manage-genders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GenderStore, ConfirmationService],
})
export class ManageGendersComponent {
  genders$ = this.genderStore.genders$;
  hasSelectedGenders$ = this.genderStore.hasSelectedGender$;
  activeGender$ = this.genderStore.activeGender$;

  genderDialog = false;

  constructor(
    private readonly genderStore: GenderStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) { }

  ngOnInit(): void {
    this.genderStore.loadGenders();

  }

  onNewClick() {
    this.genderStore.setActiveGender(null);
    this.genderDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.genderStore.deleteSelectedGenders();
        this.toastService.showWarning('Genders deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<Gender | Gender[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.genderStore.selectGender(event.data as Gender);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.genderStore.unSelectGender(event.data as Gender);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.genderStore.selectManyGenders(event.data as Gender[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.genderStore.unselectAllGenders();
        break;
      case GRID_ACTIONS.EDIT:
        this.genderStore.setActiveGender(event.data as Gender);
        this.genderDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.genderStore.deleteGender(event.data as Gender);
            this.toastService.showWarning('Gender deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.genderDialog = false;
  }

  onFormSave(gender: Gender) {
    if (gender.Id) {
      this.genderStore.updateGender(gender);
      this.toastService.showSuccess('Gender Updated!');
    }
    if (!gender.Id) {
      this.genderStore.addGender(gender);
      this.toastService.showSuccess('Gender Added!');
    }
    this.genderDialog = false;
  }
}
