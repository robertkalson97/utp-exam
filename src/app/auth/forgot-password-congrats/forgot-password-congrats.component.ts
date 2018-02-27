import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-forgot-password-congrats',
  templateUrl: './forgot-password-congrats.component.html',
  styleUrls: ['./forgot-password-congrats.component.scss']
})
export class ForgotPasswordCongratsComponent {

  constructor(
      public userService: UserService,
      public router: Router
  ) {
    let data = this.userService.selfData ? this.userService.selfData.tempData || null : null;
    if (!data) {
      this.router.navigate(['/login']);
    }
  }

}
