import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService, ToasterService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  userPass = {
    password: '',
    password2: ''
  };
  updatePasswordData = {
    user_id: '', //57dffa993319db00069a4976
    fp_token: '',
    password: ''
  };
  tokenParam: string;

  constructor(
      public activatedRoute: ActivatedRoute,
      public userService: UserService,
      public toasterService: ToasterService,
      public spinnerService: SpinnerService,
      public router: Router
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.tokenParam = params['token'];
    });

    // token validation
    this.userService.forgotPasswordTokenValidation(this.tokenParam)
        .subscribe(
            (res:any) => {
              if (res.data.valid_token) {
                this.updatePasswordData.user_id = res.data.user_id;
                this.updatePasswordData.fp_token = this.tokenParam;
              } else {
                this.toasterService.pop('error', res.message);
                this.router.navigate(['/login']);
              }
            },
            (err) => {
              this.router.navigate(['/login']);
            }
        );
  }

  onSubmit() {
    if (this.userPass.password != this.userPass.password2) {
      this.toasterService.pop('error', 'The passwords should be similar.');
    } else {
      this.updatePasswordData.password = this.userPass.password;
      this.userService.updatePassword(this.updatePasswordData)
          .subscribe((res: any) => {
            this.toasterService.pop('', res.message);
            this.router.navigate(['/login']);
          });
    }
  }

}
