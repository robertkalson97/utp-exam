import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel } from '../../../models/index';
import { UserService, PhoneMaskService } from '../../../core/services/index';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})

@DestroySubscribers()

export class CreateAccountComponent implements OnInit {
  signupAccount: UserModel;
  public phoneMask = this.phoneMaskService.defaultTextMask;
  public subscribers: any = {};
  terms: boolean = false;
  privacy: boolean = false;

  signupFormPhone: string = '';
  selectedCountry: any = this.phoneMaskService.defaultCountry;
  public showPwd: boolean = false;
  
  public logOut$: ReplaySubject<any> = new ReplaySubject(1);

  constructor(
      public userService: UserService,
      public router: Router,
      public phoneMaskService: PhoneMaskService
  ) {
  }

  ngOnInit() {
    this.signupAccount = this.userService.selfData || new UserModel();
    let phone = this.userService.selfData ? this.userService.selfData.phone || null : null;
    this.signupFormPhone = this.phoneMaskService.getPhoneByIntlPhone(phone);
    this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(phone);
  }
  
  addSubscribers() {
    this.subscribers.logOutSubscription = this.logOut$
    .switchMap(() => this.userService.logout())
    .subscribe();
  }
  
  onCountryChange($event) {
    this.selectedCountry = $event;
  }

  onSubmit(){
    this.signupAccount.phone = this.selectedCountry[2] + ' ' + this.signupFormPhone;
      this.userService.signUp(this.signupAccount)
      .subscribe(
        (res: any) => {
          if (res.data.token)
            this.userService.setSessionToken(res.data.token);
            this.router.navigate(['/signup/about-company']);
          },
          (err) => {
            console.log(err);
          }
      );
  }

  viewTerms(){
    this.terms = true;
  }

  viewPrivacy(){
    this.privacy = true;
  }

  closeText(){
    this.terms = false;
    this.privacy = false;
  }
  toggleShowPassword(){
    this.showPwd = !this.showPwd;
  }
  
  goToLogin() {
    if (this.userService.selfData.token) {
      this.logOut$.next('');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
