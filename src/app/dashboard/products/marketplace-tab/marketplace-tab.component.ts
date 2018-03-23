import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { ToasterService } from '../../../core/services/toaster.service';
import { AccountService } from '../../../core/services/account.service';
import { ProductService } from '../../../core/services/product.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { RequestProductModal } from '../request-product-modal/request-product-modal.component';
import { AddCustomProductModalComponent } from '../../../shared/modals/add-custom-product-modal/add-custom-product-modal.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-marketplace-tab',
  templateUrl: './marketplace-tab.component.html',
  styleUrls: ['./marketplace-tab.component.scss'],
})
@DestroySubscribers()
export class MarketplaceTabComponent implements OnInit {
  public subscribers: any = {};
  public nothingChecked: boolean;
  public sortBy: string = 'A-Z';
  public total: number;
  public products$: Observable<any>;
  public products: any = [];
  public selectedProducts: any = [];
  
  public infiniteScroll$: any = new BehaviorSubject(false);
  public updateCollectionCustomProduct$: any = new ReplaySubject(1);
  public selectAll$: any = new BehaviorSubject(0);
  public isRequest: boolean = false;
  public searchKey: string;
  public searchKeyLast: string;
  public locationId: string;
  public selectAll: boolean = false;
  
  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
    public accountService: AccountService,
    public toasterService: ToasterService,
  ) {
  
  }
  
  toggleView() {
    this.productService.isGrid = !this.productService.isGrid;
    
  }
  
  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.onCheck();
  }
  
  ngOnInit() {
    
    
    this.products$ = Observable
    .combineLatest(
      this.productService.collection$,
      this.productService.sortBy$,
      this.productService.searchKey$,
      this.selectAll$
    )
    .map(([products, sortBy, searchKey, selectAll]: [any, any, any, any]) => {
      this.sortBy = sortBy;
      for (let p of products) {
        (selectAll === 1) ? p.selected = true : p.selected = false;
      }
      products.map((item: any) => {
          if (!item.image && !_.isEmpty(item.images)) {
            item.image = item.images[0];
          }
          return item;
        }
      );
      return products;
    });
    
  }
  
  addSubscribers() {
    
    this.subscribers.infiniteSccrollSubscription = this.infiniteScroll$
    .filter((infinite) => infinite && !this.isRequest)
    .switchMap((infinite) => {
  
      this.isRequest = true;
  
      this.searchKeyLast = this.searchKey;
  
      if (this.total <= (this.productService.current_page) * this.productService.pagination_limit) {
        this.isRequest = false;
        return Observable.of(false);
      } else {
        if (this.searchKey == this.searchKeyLast) {
          ++this.productService.current_page;
        }
        return this.productService.getNextProducts(this.productService.current_page);
      }
    })
    .subscribe(res => {
    }, err => {
      console.log(err);
    });
    
    this.subscribers.isDataLoadedSubscription = this.productService.isDataLoaded$
    .filter(r => r)
    .do(() => this.isRequest = false)
    .delay(1000)
    .subscribe((r) => {
      this.getInfiniteScroll();
    });
    
    this.subscribers.totalCountSubscription = this.productService.totalCount$
    .subscribe(total => this.total = total);
    
    this.subscribers.locationSubscription = this.accountService.dashboardLocation$
    .subscribe((loc: any) => {
      this.locationId = loc ? loc['id'] : '';
    });
    
    this.subscribers.updateCollectionCustomProductSubscription = this.updateCollectionCustomProduct$
    .switchMap(() => {
      this.productService.current_page = 1;
      return this.productService.getNextProducts(0);
    }).subscribe();
  }
  
  toggleProductVisibility(product) {
    product.status = !product.status;
    //TODO add save to server
  }
  
  itemsSort(event) {
    let value = event.target.value;
    this.productService.updateSortBy(value);
  }
  
  requestProduct() {
    this.modal
    .open(RequestProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
  
  getInfiniteScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let toBottom = document.body.scrollHeight - scrollTop - window.innerHeight;
    let scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }
  
  onCheck() {
    this.selectedProducts = _.cloneDeep(this.products)
    .filter(r => r['selected']);
  }
  
  //showUploadDialog() {
  //  this.modal
  //  .open(UploadCsvModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
  //  .then((resultPromise) => {
  //    resultPromise.result.then(
  //      (res) => {
  //        // this.filterProducts();
  //      },
  //      (err) => {
  //      }
  //    );
  //  });
  //}
  
  addToFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, true);
  }
  
  removeFromFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, false);
  }
  
  setFavorite(product, val: boolean) {
    product.favorite = val;
    let updateData: any = {
      location_id: this.locationId,
      product: {
        id: product.id,
        favorite: val
      },
      variants: [],
    };
    let updateProduct$ = this.productService.updateProduct(updateData);
    updateProduct$.subscribe((r) => {
      this.toasterService.pop('', val ? 'Added to favorites' : 'Removed from favorites');
    });
  };
  
  resetFilters() {
    this.searchKey = '';
    this.sortBy = '';
    this.productService.current_page = 0;
    this.productService.getNextProducts(0);
  }
  
  openAddCustomProductModal() {
      this.modal
      .open(AddCustomProductModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (res) => {
            this.updateCollectionCustomProduct$.next(true);
          },
          (err) => {
          }
        );
      });
  }
}

