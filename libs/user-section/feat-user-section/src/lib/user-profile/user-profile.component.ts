import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule, NgIf } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';
import { UserProfile } from '@msh/shared/domain-models';
import { DialogModule } from 'primeng/dialog';
import { UserResetPasswordComponent } from '../user-reset-password/user-reset-password.component';
import { Subject } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-user-profile',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    AvatarModule,
    FormsModule,
    CommonModule,
    NgIf,
    PasswordModule,
    DialogModule,
    UserResetPasswordComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  submitted = false;
  displayPasswordModal = false;
  filters: TableLazyLoadEvent | null = null;

  @ViewChild('form', { static: true }) form!: NgForm;

  userProfile: UserProfile | undefined;

  avatarLabel!: string;

  userProfile$ = new Subject<UserProfile>();

  constructor(private userProfileService: UserProfileApiService) {}

  onNewClick() {
    this.displayPasswordModal = true;
  }
  onModalClose() {
    this.displayPasswordModal = false;
  }

  ngOnInit() {
    this.getUser();
  }
  onFormSave() {
    this.displayPasswordModal = false;
  }

  getUser() {
    this.userProfileService.getLoggedInUserData().subscribe(response => {
      this.userProfile$.next(response.data);
      this.userProfile = Object.assign({}, response.data);
      this.avatarLabel =
        this.userProfile.firstName.charAt(0) +
        this.userProfile.lastName.charAt(0);
    });
  }
}
