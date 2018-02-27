import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'sso',
  templateUrl: './sso.component.html'
})

export class SSOComponent {
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public router: Router,
  ) {
    
    this.activatedRoute.queryParams.subscribe(param => {
      if(param.sso_token) {
        let ssoToken = {sso_token: param.sso_token};
        this.userService.postSSOToken(ssoToken)
        .subscribe(
          (res: any) => {
            this.userService.afterLoginRedirect(res);
          }
        );
      }
    })
  }
  
}