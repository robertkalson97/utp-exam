import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ngx-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { VendorModel, AccountVendorModel } from '../../models/index';
import { BehaviorSubject } from 'rxjs';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class VendorService extends ModelService {
  pagination_limit: number = 10;
  current_page: number = 1;
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  totalCount$: BehaviorSubject<any> = new BehaviorSubject(0);
  combinedVendors$: Observable<any>;
  accountVendors$: Observable<any> = Observable.empty();
  vendors$: Observable<any> = Observable.empty();
  public isDataLoaded$: any = new BehaviorSubject(false);
  public selectedTab:any = null;
  globalVendor$: BehaviorSubject<any> = new BehaviorSubject(1);
  
  public getVendorsData$: BehaviorSubject<any> = new BehaviorSubject('my');
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  public vendorsData$: Observable<any>;
  public requestParams: any;
  public vendorsList: string;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular
  ) {
    super(restangular);
    
    // combine global vendors observable with account vendors from account observable
    this.combinedVendors$ = Observable
    .combineLatest(
      this.collection$,
      this.userService.selfData$
    )
    // filter for emitting only if user account exists (for logout user updateSelfData)
    .filter(([vendors, user]) => {
      return user.account;
    })
    .map(([vendors, user]) => {
      let accountVendors = user.account.vendors;
      // find and combine vendors
      let commonVendors = _.map(vendors, (globalVendor: any) => {
        globalVendor = new VendorModel(globalVendor);
        _.each(accountVendors, (accountVendor: VendorModel) => {
          if (accountVendor.vendor_id == globalVendor.id) {
            // globalVendor.account_vendor = accountVendor;
            globalVendor.account_vendor.push(accountVendor);
            globalVendor.priority = accountVendor.priority;
          }
        });
        return globalVendor;
      });
      return commonVendors;
    })
    .publishReplay(1).refCount();
    
    this.onInit();
  }
  
  onInit() {
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
      
      //update user after update account
      this.userService.updateSelfDataField('account', this.selfData);
    });
  
    this.vendorsData$ = Observable.combineLatest(
      this.getVendorsData$,
      this.searchKey$,
      this.accountService.dashboardLocation$,
      this.sortBy$,
    )
    .debounceTime(50)
    .publishReplay(1).refCount();
  
    this.vendorsData$
    .filter((vendors) => vendors)
    .switchMap(([vendors, searchkey, location, sortBy]) => {
    
      this.loadCollection$.next([]);
      this.current_page = 1;
      this.vendorsList = (vendors !== 'allVendors') ? vendors : '';
    
      this.requestParams = {
        page: this.current_page,
        limit: this.pagination_limit,
      };
    
      if (sortBy && sortBy === 'Z-A') {
        this.requestParams.sort = 'desc';
      }
      if (location) {
        this.requestParams.location_id = location.id;
      }
      if (searchkey) {
        this.requestParams.query = searchkey;
      }
    
      return this.getVendorsData(this.vendorsList, this.requestParams);
    })
    .subscribe();
    
  }
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }
  
  updateSearchKey(value: string) {
    this.searchKey$.next(value);
  }
  updateSortBy(value: string) {
    this.sortBy$.next(value);
  };
  
  updateVendorsData(tabName: string) {
    this.getVendorsData$.next(tabName);
  }
  
  public cleanSearch(ins: string) {
    return ins.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
  
  public getVendorsData(vendorsList, query: any = {}, reset: boolean = true) {
    const requestUrl = (vendorsList) ? this.restangular.one(vendorsList, 'vendors').customGET('', query) : this.restangular.all('vendors').customGET('', query);
    return requestUrl
    .map((res: any) => {
        if (!reset) {
          this.addCollectionToCollection$.next(res.data.vendors);
        } else {
          this.updateCollection$.next(res.data.vendors);
        }
        this.totalCount$.next(res.data.count);
        this.totalCount$.next(res.data.count);
        this.isDataLoaded$.next(true);
        return res.data.vendors;
      }
    ).catch(r => console.error(r));
  }
  
  getVendors() {
    return this.vendors$.isEmpty().switchMap((isEmpty) => {
     if (isEmpty) {
       this.vendors$ = this.restangular.all('vendors').customGET('', {limit: ''}).shareReplay(1);
     }
      return this.vendors$;
    });
  }
  
  getNextVendors(page?) {
    const reset: boolean = page ? false : true;
    this.requestParams.page = this.current_page;
    return this.getVendorsData(this.vendorsList, this.requestParams, reset);
  }
  
  getVendor(id) {
    return this.restangular.one('vendors', id).get().map(vendor => {
      this.globalVendor$.next(vendor.data.vendor);
    });
  }
  
  getAccountVendor(id) {
    return this.getAccountVendors()
    .map((vnd:any)=>vnd.filter((v:any)=>v.id==id))
  }
  
  searchVendor(query) {
    return this.restangular.all('search').getList('vendors', {query: query});
  }
  
  getAccountVendors() {
    //return this.vendors$;

    let vendorsLoaded = this.userService.selfData.account.vendors ? this.userService.selfData.account.vendors.length > -1 : false;
    if (!vendorsLoaded) {
      return this.restangular.one('accounts', this.userService.selfData.account_id).customGET('vendors')
      .map((res: any) => {
        return res.data.vendors;
      })
      .do((res: any) => {
        let account = this.userService.selfData.account;
        account.vendors = res;
        this.accountService.updateSelfData(account);
      });
    } else {
      return this.userService.selfData$.map(res => res.account.vendors);
    }
  }
  
  addAccountVendor(data) {
    let account = this.userService.selfData.account;
    let entity$ = this.restangular
    .one('accounts', account.id)
    .all('vendors')
    // .allUrl('post', 'http://api.pacific-grid.2muchcoffee.com/v1/deployments/test-post')
    .post(data);
    
    // TODO: remove after testing
    // let entity$ = this.httpService.post('http://uptracker-api.herokuapp.com/api/v1/accounts/' + data.get('account_id') + '/vendors', data);
    
    
    return entity$
    .map((res: any) => {
      return res.data.vendor;
    })
    .do((res: any) => {
      account.vendors.push(res);
      this.accountService.updateSelfData(account);
    });
  }
  
  editAccountVendor(vendorInfo: any, data) {
    let account = this.userService.selfData.account;
    // if no id then add new vendor
    if (!vendorInfo.id) {
      
      return this.addAccountVendor(data);
    } else {
      
      let entity$ = this.restangular
      .one('accounts', vendorInfo.account_id)
      .one('vendors', vendorInfo.id)
      .customPUT(data, undefined, undefined, {'Content-Type': undefined});
      
      return entity$
      .map((res: any) => {
        return res.data.vendor;
      })
      .do((res: any) => {
        let vendorArr = _.map(account.vendors, function (vendor) {
          return vendor['id'] == res.id ? res : vendor;
        });
        account.vendors = vendorArr;
        this.accountService.updateSelfData(account);
      });
    }
  }
}