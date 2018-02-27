import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, CardService, AccountService } from '../../../core/services/index';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent {
  signupAccount: any = {
    account: {},
    user: {},
    card: {}
  };

  constructor(
      public userService: UserService,
      public accountService: AccountService,
      public cardService: CardService,
      public router: Router
  ) {
    // if payment token doesn't exist then redirect user to login (authorized user will be automatically redirected to dashboard)
    let payment_token = this.userService.selfData.account ? this.userService.selfData.account.payment_token || null : null;
    if (!payment_token){
      this.router.navigate(['/login']);
    }
  }
}
