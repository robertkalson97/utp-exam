import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Restangular } from 'ngx-restangular';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { BehaviorSubject } from 'rxjs';
import { InventorySearchResults } from '../../models/inventory.model';
import { ToasterService } from './toaster.service';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class InventoryService extends ModelService {
  
  public isGrid: boolean = false;
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  current_page: number = 1;
  pagination_limit: number = 10;
  combinedInventory$: Observable<any>;
  public isDataLoaded$: any = new BehaviorSubject(false);
  totalCount$: any = new BehaviorSubject(1);
  location$: any = new BehaviorSubject(false);
  getInventoryData$: any = new Subject();
  location: string;
  total: number = 1;
  outerPackageList = [];
  innerPackageList = [];
  consumablePackageList = [];
  public selectedStep3Tab:any = null;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular,
    public toasterService: ToasterService
  ) {
    super(restangular);
    
    this.combinedInventory$ = Observable
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
  
    this.getAllInventories();
    
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
    
    this.loadCollection$.next([]);
    
  }
  
  getAllInventories() {
    this.getInventoryData$
    .withLatestFrom(this.location$)
    .map(([queryParams, location]) => {
      if (location) {
        queryParams.query.location_id = location.id;
      }
      return queryParams;
    })
    .switchMap((queryParams) => {
      return this.restangular.all('inventory').customGET('', queryParams.query)
      .map(res => {
        res.data.map((item: any) => Object.assign(item, {status: 1}));
        
        if (queryParams.reset) {
          this.updateCollection$.next(res.data);
        } else {
          this.addCollectionToCollection$.next(res.data);
        }
        
        this.totalCount$.next(res.count);
        this.isDataLoaded$.next(true);
        return res.data;
      });
    })
    .subscribe();
  }
  
  getNextInventory(page?, search_string?, sortBy?) {
    if (page == 0) {
      this.current_page = 1;
      this.updateCollection$.next([]);
    }
    let query: any = {
      page: this.current_page,
      limit: this.pagination_limit,
    };
    if (search_string) {
      query.query = search_string;
    };
    if (sortBy && sortBy == 'Z-A') {
      query.sort = 'desc';
    }
    return this.getInventoryData(query, page ? false : true);
  }
  
  public getInventoryData(query: any = {}, reset: boolean = true) {
    this.getInventoryData$.next({query, reset});
    return this.getInventoryData$.delay(1000);
  }
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }

  updateInventory(inventory: any) {
    return this.restangular.one('inventory', inventory.id).customPUT(inventory)
    .map((updatedInventory: any) => {
      this.updateInventoryCollection(updatedInventory.data);
      return updatedInventory.data;
    });
  }
  
  updateInventoryCollection(data: any) {
    this.updateElementCollection$.next(data);
  }
  
  setFavorite(inventory) {
    let postData = {
      inventory_id: inventory.id || inventory.inventory_id,
      favorite: !inventory.favorite
    }
    return this.restangular.one('inventory', 'favorite').customPOST(postData).map((res: any) => res.data);
  }
  
  getInventoryItem(id: string) {
    //GET /api/v1/invntory/{inventory_id}
    return this.restangular.one('inventory', id || 1).customGET().map((res: any) => res.data);
  }
  
  addItemsToInventory(newInventory) {
    return this.restangular.all('inventory').customPOST(newInventory)
    .map((newInventory: any) =>
      {
        this.totalCount$.next(this.totalCount$['_value']+1);
        this.addCollectionToCollection$.next(newInventory.data);
        return newInventory.data;
      }
    );
  }
  
  search(keyword: string) {
    //GET /api/v1/inventory/search?q={keyword,upc,catalog number}
    return this.restangular.one('inventory', 'search').customGET('', {'q': keyword}).map((res: any) => res.data);
  }
  autocompleteSearch(keywords: string) {
    return this.restangular.one('inventory', 'suggest').customGET('', {'q': keywords}).map((res: any) => res.data);
  }
  
  autocompleteSearchVendor(keywords: string) {
    return this.restangular.one('vendors', 'suggest').customGET('', {'q': keywords}).map((res: any) => res.data.suggestions);
  }
  autocompleteSearchPackage(keywords: string) {
    return this.restangular.one('inventory', 'suggest').all('unit').customGET('', {'q': keywords}).map((res: any) => res.data.suggestions);
  }
  
  addInventoryItemComment(comment) {
    return this.restangular.all('comments').post(comment).map(res => res.data);
  }
  
  deleteInventoryItemComment(id) {
    return this.restangular.one('comments', id).remove()
  }
  
  editInventoryItemComment(comment) {
    let commentRestangularized = this.restangular.restangularizeElement(null, comment, "comments");
    return commentRestangularized.put()
  }
  
  checkIfNotExist(items:InventorySearchResults[]){
    let payload = {
      products: items.map(item => {
        return {
          product_id: item.product_id,
          variant_id:item.variant_id
        }
      })
    }
    return this.restangular.one('inventory', 'check').customPOST(payload).map((res: any) => res.data);
  }
  
  getPackagesLists() {
   return this.restangular.one('config', 'product_units').customGET('')
      .map(res => {
       this.outerPackageList = res.data.outer_package;
       this.innerPackageList = res.data.inner_package;
       this.consumablePackageList = res.data.consumable_unit;
      })
  }
  
  deleteInventory(inventory) {
    return this.restangular.one('inventory', inventory.id).remove();
  }

  uploadAttachment(document: File): Observable<any> {
    if (!document) {
      return Observable.of({'continue': 'no docs to upload'});
    }
    let formData: FormData = new FormData();
    formData.append('attachment', document);
    return this.restangular
    .one('inventory', 'attachment')
    .customPOST(formData)
    .map((res: any) => res.data);
  }
}
