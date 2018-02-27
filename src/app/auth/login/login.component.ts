import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser = {
    email: '',
    password: ''
  };
  public showPwd: boolean;

  constructor(
      public userService: UserService,
      public router: Router,
      public spinnerService: SpinnerService
  ) {
  }

  onSubmit(event) {
    if (!event.target.checkValidity()){
      return;
    }

    this.userService.login(this.loginUser)
        .subscribe(
            (res: any) => {
              this.userService.afterLoginRedirect(res);
            //  // check account status and set redirect link
            //  let redLink: string = '';
            //  let account_status: any = this.userService.selfData.account ? this.userService.selfData.account.status || null : null;
            //  account_status != 2 ? redLink='/onboard/locations' : redLink='/dashboard';
            //
            //  // Get the redirect URL from service
            //  // If no redirect has been set, use the default
            //  let redirect = this.userService.redirectUrl ? this.userService.redirectUrl : redLink;
            //
            //  // check for passing signup steps for navigation
            //  let signupStep = this.userService.currentSignupStep();
            //  switch(signupStep) {
            //    case 2:   this.router.navigate(['/signup', 'about-company']); return;
            //    case 3:   this.router.navigate(['/signup', 'payment-info']); return;
            //    case 4:   this.router.navigate(['/email-verification']); return;
            //    default:  this.router.navigate([redirect]);
            //  }
            }
        );
  }
  
  toggleShowPassword(){
    this.showPwd = !this.showPwd;
  }
}
