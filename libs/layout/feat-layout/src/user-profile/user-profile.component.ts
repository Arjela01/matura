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
import { UserProfile } from '@msh/layout/domain-layout';
import { UserProfileApiService } from '@msh/layout/data-access-layout';
import { AvatarModule } from 'primeng/avatar';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { CommonModule, NgIf } from '@angular/common';
import {PasswordModule} from "primeng/password";

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
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  isShowForm = false;
  submitted = false;
  @ViewChild('form', { static: true }) form!: NgForm;
  userProfile: UserProfile = {
    children: [],
    email: 'admin@admin.com',
    firstName: 'Admin',
    isActive: false,
    lastName: 'Admin',
    roleId: '',
    roleName: 'Admin',
    userName: 'Admin',
  };

  constructor(
    private userProfileService: UserProfileApiService,
    private auth: AuthFacade
  ) {}
  toggleDisplayForm() {
    this.isShowForm = !this.isShowForm;
  }
  onCancelClick(){
    this.isShowForm = false;
}

  ngOnInit() {
    let userId = '';
    this.auth.user$.subscribe(res => (userId = res.userId));
    return this.userProfileService
      .getUserById(userId)
      .pipe()
      .subscribe(user => (this.userProfile = user));
  }
}
