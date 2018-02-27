import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../spinner/spinner.component'
import { UserModel, CreditCardModel } from '../../../models/index';
import { UserService, CardService, AccountService, SpinnerService } from '../../../core/services/index';


@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  public creditCard: CreditCardModel;
  public trialCode: string;
  public cardMask: any;
  public cvcMaskFunction: any;
  public cvcMask: any = [/\d/, /\d/, /\d/];
  public masks = {
    cvc: [/\d/, /\d/, /\d/, /\d/]
  };
  public selectMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public selectYear = [];
  public yearDirty: boolean = false;
  public monthDirty: boolean = false;
  //public isHidden: boolean = true; //TODO remove
  //@ViewChild("buttonsubmit") button_submit;
  
  constructor(
    public router: Router,
    public userService: UserService,
    public accountService: AccountService,
    public spinnerService: SpinnerService,
    public cardService: CardService
  ) {
    let signupStep = this.userService.currentSignupStep();
    if (signupStep && signupStep < 3) {
      this.router.navigate(['/signup']);
    }
    this.cardMask = function (value) {
      let cardOther = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      let cardAmex = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
      
      let cardStr = '' + value;
      let cardArr = cardStr.split("");
      if (cardArr[0] == '3' && (cardArr[1] == '4' || cardArr[1] == '7')) {
        this.cvcMask = [/\d/, /\d/, /\d/, /\d/];
        return cardAmex;
      } else {
        this.cvcMask = [/\d/, /\d/, /\d/];
        return cardOther;
      }
    }.bind(this);
    this.cvcMaskFunction = function (value) {
      return this.cvcMask;
    }.bind(this);
  }
  
  ngOnInit() {
    this.creditCard = new CreditCardModel;
    this.trialCode = '';
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 21; i++) {
      this.selectYear.push(currentYear + i);
    }
    
    //// fake data
    //
    //this.creditCard.expMonth = 12;
    //this.creditCard.expYear = 2018;
    //this.creditCard.cvc = 123;
    //this.creditCard.cardNumber = 4111111111111111;
    //this.button_submit.nativeElement.click();
    
  }
  
  changeYear() {
    this.yearDirty = true;
  }
  
  changeMonth() {
    this.monthDirty = true;
  }
  
  onSubmit() {
    if (this.trialCode != '') {
      this.router.navigate(['/signup/congrats']);
    } else {
      let self = this;
      this.cardService.getToken(self.creditCard)
      .switchMap(cardData => {
        cardData.trial_code = self.trialCode;
        // set account_id
        // if user is logged in and created company (have account_id)
        cardData.account_id = self.userService.selfData ? self.userService.selfData.account_id || null : null;
        return self.cardService.addCard(cardData);
      })
      .subscribe((res: any) => {
        self.accountService.updateSelfData(res.data.account);
        this.router.navigate(['/login']);
      });
    }
  }
  
}
