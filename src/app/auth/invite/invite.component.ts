import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UserModel, InviteUserModel, InviteUserPwdModel } from '../../models/index';
import { UserService, PhoneMaskService } from '../../core/services/index';
import { SpinnerService } from '../../core/services/spinner.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  public invitationInfo: InviteUserPwdModel;
  private invitaionCode:string = '';
  signupAccount: UserModel;
  public phoneMask = this.phoneMaskService.defaultTextMask;
  terms: boolean = false;
  privacy: boolean = false;
//TODO on phone change
  signupFormPhone: string = '';
  selectedCountry: any = this.phoneMaskService.defaultCountry;
  public showPwd: boolean = false;
  
  constructor(
    public userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public toasterService: ToasterService,
    public phoneMaskService: PhoneMaskService
  ) {
  }
  
  ngOnInit() {
    this.invitationInfo = new InviteUserPwdModel;
    
    this.spinnerService.show();
    this.route.params
    .switchMap((p: Params) => {
      this.invitaionCode = p['invite_id'];
      return this.userService.validateInvitation(p['invite_id']);
    })
    .map((r) => r['data'])
    .subscribe((userInfo: InviteUserModel) => {
        this.spinnerService.hide();
        if (userInfo.name && userInfo.email_address || userInfo.user_id) {
          this.invitationInfo = Object.assign({password: ''}, userInfo);
          console.log('invitation', this.invitationInfo);
        } else {
          this.onInviteFail();
        }
      },
      (error: any) => this.onInviteFail()
    );
    
    this.signupAccount = this.userService.selfData || new UserModel();
    let phone = this.userService.selfData ? this.userService.selfData.phone || null : null;
    this.signupFormPhone = this.phoneMaskService.getPhoneByIntlPhone(phone);
    this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(phone);
  }
  
  onInviteFail() {
    // pop msg and redir
    this.spinnerService.hide();
    this.toasterService.pop('', 'Sorry, but you can not use this code for registration');
    this.router.navigate(['/signup']);
  }
  
  onCountryChange($event) {
    this.selectedCountry = $event;
  }
  
  onSubmit() {
    this.invitationInfo.phone = this.selectedCountry[2] + ' ' + this.signupFormPhone;
    this.userService.sendInvitationData(this.invitaionCode, this.invitationInfo)
    .map((res:any)=>{
      res.data.user.new_token = res.data.token;
      res.data.user.token = res.data.token;
      res.data.user.account = res.data.account;
      return res.data.user;
    })
    .subscribe(
      (user: any) => {
        if (user.token) {
          this.userService.updateSelfData(user);
          this.userService.setSessionToken(user.token);
          this.userService.setSessionId(user.id);
        }
        this.router.navigate(['/dashboard']);
      },
      (err) => {
      }
    );
  }
  
  viewTerms() {
    this.terms = true;
  }
  
  viewPrivacy() {
    this.privacy = true;
  }
  
  closeText() {
    this.terms = false;
    this.privacy = false;
  }
  
  toggleShowPassword() {
    this.showPwd = !this.showPwd;
  }
}
