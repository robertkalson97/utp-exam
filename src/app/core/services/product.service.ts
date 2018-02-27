import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ngx-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ProductService extends ModelService {
  
  public isGrid: boolean = false;
  public selfData: any;
  public selfData$: Observable<any>;
  public updateSelfData$: Subject<any> = new Subject<any>();
  public current_page: number = 1;
  public pagination_limit: number = 10;
  public combinedProducts$: Observable<any>;
  public isDataLoaded$: any = new BehaviorSubject(false);
  public totalCount$: any = new BehaviorSubject(1);
  public location$: any = new BehaviorSubject(false);
  public getProductsData$: any = new BehaviorSubject({});
  public getMarketplaceData$: ReplaySubject<any> = new ReplaySubject(1);
  //public getMarketplaceData$: Subject<any> = new Subject<any>();
  public location: string;
  public total: number = 1;
  public dashboardLocation: any;
  
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchKey: string;
  
  public marketplace: string;
  
  marketplaceData$: Observable<any>;
  
  public requestParams: any;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular
  ) {
    super(restangular);
    
    this.combinedProducts$ = Observable
    .combineLatest(
      this.collection$,
      this.userService.selfData$
    )
    .filter(([vendors, user]) => {
      return user.account;
    })
    .publishReplay(1).refCount();
    
    this.onInit();
  }
  
  onInit() {
    
    this.marketplaceData$ = Observable.combineLatest(
      this.getMarketplaceData$,
      this.accountService.dashboardLocation$,
      this.searchKey$,
      this.sortBy$,
    )
    .debounceTime(50)
    .publishReplay(1).refCount();
    
    this.marketplaceData$
    .filter((marketplace) => marketplace && marketplace !== 'home')
    .switchMap(([marketplace, location, searchkey, sortBy]) => {
      
      this.loadCollection$.next([]);
      this.current_page = 1;
      this.marketplace = marketplace;
      
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
      
      return this.getMarketPlace(marketplace, this.requestParams);
    })
    .subscribe();
    
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
    
  }
  
  getNextProducts(page?) {
    let reset: boolean = page ? false : true;
    this.requestParams.page = this.current_page;
    return this.getMarketPlace(this.marketplace, this.requestParams, reset);
  }
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }
  
  //only for resolver. it works anyway through constructor
  getProducts() {
    return Observable.of([]);
  }
  
  getMarketPlace(marketplace: string, queryParams: {[key:string]: any}, reset: boolean = true) {
    return this.restangular.one('marketplace', marketplace).customGET('', queryParams)
    .map(res => {
      if (!reset) {
        this.addCollectionToCollection$.next(res.data.results);
      } else {
        this.updateCollection$.next(res.data.results);
      }
      this.totalCount$.next(res.data.count);
      this.isDataLoaded$.next(true);
      return res.data.results;
    });
  }
  
  updateSearchKey(value: string) {
    this.searchKey$.next(value);
  }
  updateSortBy(value: string) {
    this.sortBy$.next(value);
  };
  
  updateMarketplaceData(tabName: string) {
    this.getMarketplaceData$.next(tabName);
  }
  
  getProduct(id) {
    return this.restangular.one('products', id).get();
  }
  
  getBulkEditAdditionalInfo(ids: string[]) {
    return this.restangular.all('products').all('bulk')
    .customPOST(JSON.stringify({"product_ids": ids}), undefined, undefined, {'Content-Type': "application/json"});
  }
  
  getProductLocation(id, location_id) {
    return this.restangular.one('products', id).get({location_id: location_id});
  }
  
  addProductComment(comment) {
    return this.restangular.all('comments').post(comment)
  }
  
  deleteProductComment(id) {
    return this.restangular.one('comments', id).remove()
  }
  
  editProductComment(comment) {
    let commentRestangularized = this.restangular.restangularizeElement(null, comment, "comments");
    return commentRestangularized.put()
  }
  
  updateProduct(data: any) {
    console.log(data);
    return this.restangular.one('accounts', this.userService.selfData.account_id).all('products').post(data);
  }
  
  bulkUpdateProducts(data: any) {
    return this.restangular.one('accounts', this.userService.selfData.account_id).all('products').all('bulk').post(data);
  }
  
  deepDiff(obj1: any, obj2: any): any {
    if (_.isFunction(obj1) || _.isFunction(obj2)) {
      throw 'Invalid argument. Function given, object expected.';
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      if (obj1 != obj2) {
        return obj1;
      } else {
        return 'unmdf';
      }
    }
    let diff: any;
    if (_.isArray(obj1)) {
      diff = [];
    } else {
      diff = {};
    }
    let cnt = 0;
    for (let key in obj1) {
      if (_.isFunction(obj1[key])) {
        continue;
      }
      let value2 = undefined;
      if ('undefined' != typeof(obj2[key])) {
        value2 = obj2[key];
      }
      let val = this.deepDiff(obj1[key], value2);
      if (val != "unmdf" && (!_.isEmpty(val) || this.isValue(val)) && key != 'detailView') {
        if (_.isArray(obj1)) {
          diff.push(val);
        } else {
          diff[key] = val;
        }
        cnt++;
      }
    }
    if (cnt != 0 && obj1.id) {
      diff['id'] = obj1.id;
    }
    return diff;
  };
  
  isValue(obj) {
    return !_.isObject(obj) && !_.isArray(obj);
  }
  
  emptyValues(obj: any): any {
    if (obj === false || this.isValue(obj)) {
      return true;
    }
    if (_.isEmpty(obj)) {
      return false;
    }
    for (let i in obj) {
      if (this.emptyValues(obj[i])) {
        return true
      }
      ;
    }
    return false;
  }
  
  addCustomProduct(data) {
    return this.restangular.all('products').all('custom').post(data).map(res => res.data);
  }
  
}