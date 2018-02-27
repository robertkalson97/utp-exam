import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, ToasterService } from '../../core/services/index';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
@DestroySubscribers()
export class EmailVerificationComponent implements OnInit {
  public subscribers: any = {};
  tokenParam: string;
  buttonDisabled: boolean = false;

  constructor(
      public activatedRoute: ActivatedRoute,
      public userService: UserService,
      public toasterService: ToasterService,
      public router: Router
  ) {
    let signupStep = this.userService.currentSignupStep();
    if (signupStep && signupStep < 4) {
      this.router.navigate(['/signup']);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.tokenParam = params['token'] || null;
    });

    // if empty token then no need to validate email
    if (!this.tokenParam) {
      return;
    }

    // email validation
    this.subscribers.verificationSubscription = this.userService.verification(this.tokenParam)
        .subscribe(
            (res: any) => {
              this.router.navigate(['/onboard', 'locations']);
            },
            (err) => {
              this.router.navigate(['/login']);
            }
        );
  }
  
  onResend() {
    this.subscribers.resendSubscription = this.userService.resendVerification()
        .subscribe(
            (res: any) => {
              this.toasterService.pop('', res.message);
              this.buttonDisabled = true;
            },
            (err) => {
              this.userService.logout('/login');
            }
        );
  }

}
