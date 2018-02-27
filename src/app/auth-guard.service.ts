import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, StateService } from './core/services/index';
import { UserModel } from './models/index';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  selfData: any;

  constructor(
    public userService: UserService,
    public router: Router
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let url: string = state.url;
    
    return this.guard(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  canLoad(
      route: Route
  ): Observable<boolean> | boolean {
    let url = `/${route.path}`;

    return this.guard(url, true);
  }
  
  guard(url, lazy = false){
    let user$ = this.userService.loadSelfData().map((res) => {
      // if logged out guest remove self data
      if (this.userService.isGuest()){
        this.userService.updateSelfData(new UserModel());
      }
      // let url: string = state.url;
      let location = url.split('/')[1];
      switch (location) {
        case 'login':
          return this.checkLogin();
        case 'forgot-password':
          return this.checkForgotPassword();
        case 'signup':
          // handling '/signup' url which is used for lazy loading and for create account step of signup
          // if lazy loading - signup main routing, if ordinary load - signup steps routings
          return lazy ? this.checkSignup() : this.checkSignupSteps(url);
        case 'onboard':
          return this.checkOnboard(url);
        case 'dashboard':
        case 'products':
        case 'vendors':
        case 'locations':
        case 'users':
          return this.checkDashboard(url);
        default:
          return true;
      }
    });
    return user$.take(1);
  }

  checkSignup() {
    if (this.userService.isGuest()) {
      return true;
    }

    //if (this.userService.emailVerified()) {
    //  this.router.navigate(['/dashboard']);
    //  return false;
    //}

    // TODO: remove after testing
    // if (this.userService.currentSignupStep() == 4) {
    //   this.router.navigate(['/email-verification']);
    //   return false;
    // }

    return true;
  }

  checkSignupSteps(url){
    //if (this.userService.emailVerified()) {
    //  this.router.navigate(['/dashboard']);
    //  return false;
    //}

    let registerInProgress: boolean = function(): boolean {
      switch( _.last(url.split('/')) ) {
        case 'signup': return true;
        case 'about-company': return true;
        case 'payment-info': return true;
        default: return false;
      }
    }();

    //if (this.userService.currentSignupStep() == 4 && registerInProgress) {
    //  this.router.navigate(['/email-verification']);
    //  return false;
    //}

    return true;
  }

  checkOnboard(url: string): boolean {
    if (!this.checkAuth(url)) {
      return false;
    }

    // if onboarding was completed redirect to dashboard
    if (this.userService.selfData.account.status == 2){
      this.router.navigate(['/dashboard']);
      return false;
    }

    // redirect to locations page if at least one location wasn't added
    let onboardStep = this.userService.selfData.account.onboarding_step || 'locations';
    if (onboardStep == 'locations' && _.last(url.split('/')) != 'locations' && _.last(url.split('/')) != 'onboard' ) {
      this.router.navigate(['/onboard','locations']);
      return false;
    }

    return true;
  }

  checkDashboard(url: string): boolean { 
    if (!this.checkAuth(url)) {
      return false;
    }

    let account_status = this.userService.selfData.account.status || null;

    if (account_status != 2) {
      this.router.navigate(['/onboard','locations']);
      return false;
    }
    return true;
  }

  checkAuth(url: string) {
    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;

    // Navigate to the login page if guest
    if (this.userService.isGuest() || !this.userService.selfData) {
      this.router.navigate(['/login']);
      return false;
    }

    //if (!this.userService.emailVerified()) {
    //  // check for passing signup steps for navigation
    //  let signupStep = this.userService.currentSignupStep();
    //  switch(signupStep) {
    //    case 2:   this.router.navigate(['/signup', 'about-company']); return;
    //    case 3:   this.router.navigate(['/signup', 'payment-info']); return;
    //    //case 4:   this.router.navigate(['/email-verification']); return;
    //    case 4:   this.router.navigate(['/login']); return;
    //    default:  this.router.navigate(['/signup']);
    //  }
    //  return false;
    //}

    return true;
  }

  checkLogin(){
    if (!this.userService.isGuest() && this.userService.selfData.status == 1){
      this.router.navigate(['/onboard', this.userService.selfData.account.onboarding_step]);
      return false;
    }

    if (!this.userService.isGuest() && this.userService.selfData.status == 2){
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
  
  checkForgotPassword(){
    return this.checkLogin();
  }
}