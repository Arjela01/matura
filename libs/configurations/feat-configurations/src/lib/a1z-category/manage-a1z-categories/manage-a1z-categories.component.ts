import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { A1ZCategory } from '@msh/shared/domain-models';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { A1ZCategoryApiService } from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { A1zCategoryFormComponent } from '../a1z-category-form/a1z-category-form.component';
import { A1zCategoryGridComponent } from '../a1z-category-grid/a1z-category-grid.component';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
@UntilDestroy()
@Component({
  selector: 'msh-manage-a1z-categories',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    A1zCategoryFormComponent,
    A1zCategoryGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-a1z-categories.component.html',
  styleUrls: ['./manage-a1z-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageA1zCategoriesComponent {
  private a1zCategories$$ = new BehaviorSubject<A1ZCategory[]>([]);
  a1zCategories$ = this.a1zCategories$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedA1zCategory: A1ZCategory | null = null;
  selectedA1zCategories: A1ZCategory[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly a1zCategoryApiService: A1ZCategoryApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedA1zCategory = {} as A1ZCategory;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini kategoritë A1Z të zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Kategoritë A1Z të zgjedhura u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<A1ZCategory | A1ZCategory[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedA1zCategories = [
          ...this.selectedA1zCategories,
          event.data as A1ZCategory,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedA1zCategories = this.selectedA1zCategories.filter(a1z => {
          a1z.id !== (event.data as A1ZCategory).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedA1zCategories = [
          ...this.selectedA1zCategories,
          ...(event.data as A1ZCategory[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedA1zCategories = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedA1zCategory = Object.assign({}, event.data as A1ZCategory);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini kategorinë e zgjedhur?',
          accept: () => {
            this.deleteA1zCategory(event.data as A1ZCategory);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(a1zCategories: A1ZCategory) {
    if (a1zCategories.id) {
      this.updateA1zCateogry(a1zCategories);
    }
    if (!a1zCategories.id) {
      this.addA1zCategory(a1zCategories);
    }
  }

  getA1zCategories($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.a1zCategoryApiService
      .loadA1ZCategories($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.a1zCategories$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addA1zCategory(a1zCategory: A1ZCategory) {
    this.a1zCategoryApiService
      .save(a1zCategory)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Kategoria A1Z u shtua me sukses!');
          this.displayModal = false;
          this.getA1zCategories(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të vitit akademik!'
          );
      });
  }

  updateA1zCateogry(a1zCategory: A1ZCategory) {
    this.a1zCategoryApiService
      .update(a1zCategory)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Kategoria A1Z u ndryshua me sukses!');
          this.displayModal = false;
          this.getA1zCategories(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të vitit akademik!'
          );
      });
  }

  deleteA1zCategory(a1zCategory: A1ZCategory) {
    this.a1zCategoryApiService
      .delete(a1zCategory.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Kategoria A1Z u fshi me sukses!');
          this.getA1zCategories(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së kategorisë A1Z!'
          );
      });
  }
}
