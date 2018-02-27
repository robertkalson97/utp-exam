import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ToasterService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  draftUser;

  constructor(
      public userService: UserService,
      public toasterService: ToasterService,
      public router: Router,
      public spinnerService: SpinnerService
  ) {
  }

  ngOnInit() {
    this.draftUser = {
      email_address: ''
    };
  }

  onSubmit() {
    let self = this;
    this.userService.forgotPasswordRequest(this.draftUser)
        .subscribe((res: any) => {
          res.data = res.data || 'Forgotten password request sent.';
          self.userService.selfData ? self.userService.selfData.tempData = res.data : self.userService.selfData = { tempData: res.data };
          this.router.navigate(['/forgot-password-congrats']);
        });
  }

}
