import { Injectable } from '@angular/core';
import { CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { SessionService, StateService } from './core/services/index';
import { AccountingComponent } from './onboard/accounting/accounting.component';
import { OnboardLocationsComponent } from './onboard/locations/locations.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<AccountingComponent>{
  constructor(
    public sessionService: SessionService,
    public router: Router
  ) {
  }
  
  canDeactivate(
    accountingComponent: AccountingComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    /*****
     * Service for test!
     * it is not used
     * TODO: remove when not necessary
     **********************************/


    
    // if (!accountingComponent.accounting || accountingComponent.accounting == accountingComponent.accountService.onboardacc)
    //     return true;

    _.each(accountingComponent.accounting, (key, value) => {
      this.sessionService.setLocal(key, value);
    });

    return true;

    // let user$ = this.userService.loadSelfData().map((res) => {
    //   // if logged out guest remove self data
    //   if (this.userService.isGuest()){
    //     this.userService.updateSelfData(new UserModel());
    //   }
    //   // let url: string = state.url;
    //   let location = url.split('/')[1];
    //   switch (location) {
    //     case 'login':
    //       return this.checkLogin();
    //     case 'forgot-password':
    //       return this.checkForgotPassword();
    //     case 'signup':
    //       // handling '/signup' url which is used for lazy loading and for create account step of signup
    //       // if lazy loading - signup main routing, if ordinary load - signup steps routings
    //       return lazy ? this.checkSignup() : this.checkSignupSteps(url);
    //     case 'onboard':
    //       return this.checkOnboard(url);
    //     case 'dashboard':
    //       return this.checkDashboard(url);
    //     default:
    //       return true;
    //   }
    // });
    // return user$.take(1);
  }
}