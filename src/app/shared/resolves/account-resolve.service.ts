import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService, VendorService } from '../../core/services/index';
import { LocationService } from "../../core/services/location.service";

@Injectable()
export class UserCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getUsers().take(1).subscribe();
  }
}

@Injectable()
export class RoleCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getRoles().take(1);
  }
}

// TODO: Remove when location service tested
// @Injectable()
// export class LocationCollectionResolve implements Resolve<any> {
//   constructor(
//       public accountService: AccountService
//   ) {
//
//   }
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     return this.accountService.getLocations().take(1);
//   }
// }

@Injectable()
export class LocationCollectionResolve implements Resolve<any> {
  constructor(
    public locationService: LocationService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.locationService.getLocations().take(1);
  }
}

@Injectable()
export class AccountVendorCollectionResolve implements Resolve<any> {
  constructor(
      public vendorService: VendorService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.vendorService.getAccountVendors().take(1);
  }
}

// an array of services to resolve routes with data
export const ACCOUNT_RESOLVER_PROVIDERS = [
  UserCollectionResolve,
  RoleCollectionResolve,
  LocationCollectionResolve,
  AccountVendorCollectionResolve
];