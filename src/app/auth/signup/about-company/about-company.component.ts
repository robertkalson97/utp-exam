import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService, UserService, SpinnerService } from '../../../core/services/index';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss']
})
export class AboutCompanyComponent implements OnInit {
  signupAccount: any = {};

  constructor(
      public accountService: AccountService,
      public userService: UserService,
      public spinnerService: SpinnerService,
      public router: Router,
      public zone: NgZone,
  ) {
    let signupStep = this.userService.currentSignupStep();
    if (signupStep == 1) {
      this.router.navigate(['/signup']);
    }
  }

  ngOnInit() {
    // check for user_id
    this.signupAccount.user_id = this.userService.getSelfIdFromSelfData();
    if (this.userService.selfData.account) {
      this.signupAccount = {
        user_id: this.signupAccount.user_id,
        id: this.userService.selfData.account.id,
        company_name: this.userService.selfData.account.company_name,
        company_email: this.userService.selfData.account.contact_email_address,
        street_1: this.userService.selfData.account.address.street_1,
        street_2: this.userService.selfData.account.address.street_2,
        city: this.userService.selfData.account.address.city,
        zip: this.userService.selfData.account.address.postal_code,
        formattedAddress: this.userService.selfData.account.address.formattedAddress,
        marys_list_member: this.userService.selfData.account.marys_list_member
      };
    }
  }

  onSubmit(){
    this.accountService.createCompany(this.signupAccount)
        .subscribe((res: any) => {
          let user = this.userService.transformAccountInfo(res.data);
          this.userService.updateSelfData(user);
          // this.router.navigate(['/signup/payment-info']);  // TODO: put this back when payment is required
          this.router.navigate(['/signup/congrats']);
        });
  }

  addGoogleAddress(event) {
    if(event.address_components) {
      event.address_components.forEach((item) => {
        switch (item.types[0]) {
          // case 'country':
          //   this.location.country = item.long_name;
          //   break;
          case 'administrative_area_level_1':
            this.signupAccount.state = item.short_name;
            break;
          case 'locality':
            this.signupAccount.city = item.long_name;
            break;
          case 'route':
            this.signupAccount.street_1 = item.long_name;
            break;
          case 'street_number':
            this.signupAccount.street_2 = item.long_name;
            break;
          case 'postal_code':
            this.zone.run(() => {
              this.signupAccount.zip = item.long_name;
            });
            break;
        }
      });
    }


    this.signupAccount.formattedAddress = event.inputValue;


  }

}
