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
import { UserProfile } from '@msh/user-section/domain-user-section';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';


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
  submitted = false;
  @ViewChild('form', { static: true }) form!: NgForm;
  userProfile!: UserProfile;
  avatarLabel!: string;
  constructor(private userProfileService: UserProfileApiService) {}
  ngOnInit() {
    this.getUser();
  }
  getUser() {
    this.userProfileService.getLoggedInUserData().subscribe(response => {
      this.userProfile = Object.assign({}, response.data);
      this.avatarLabel =
        this.userProfile.firstName.charAt(0) +
        this.userProfile.lastName.charAt(0);
      console.log(111 , this.userProfile)
    });
  }
}
