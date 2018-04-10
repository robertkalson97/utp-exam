import { Component, OnInit, HostListener, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from '../../core/services/modal-window.service';
import { AccountService } from '../../core/services/account.service';
import { ToasterService } from '../../core/services/toaster.service';
import { InventoryService } from '../../core/services/inventory.service';
import { AddInventoryModal } from './add-inventory/add-inventory-modal.component';
import { Subject } from 'rxjs/Subject';
import { InventoryGroupFiltersComponent } from '../../shared/modals/filters-modal/inventory-group-filters/inventory-group-filters.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
@DestroySubscribers()
export class InventoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input('inputRange') inputRange;

  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string = 'A-Z';
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject('A-Z');
  public total: number;
  public products$: Observable<any>;
  public products: any = [];
  public selectedInventory: any = [];

  public infiniteScroll$: any = new BehaviorSubject(false);
  public selectAll$: any = new BehaviorSubject(0);
  public isRequest: boolean = false;
  public searchKey: string;
  public searchKeyLast: string;
  public locationId: string;
  public selectAll: boolean = false;
  public rangeFields: any[] = [];
  public quantity: number = 3;
  public thumbColor: string = '#000000';
  public updateFavorite$: any = new Subject();

  constructor(
    public modal: Modal,
    public inventoryService: InventoryService,
    public modalWindowService: ModalWindowService,
    public accountService: AccountService,
    public toasterService: ToasterService
  ) {
  }

  toggleView() {
    this.inventoryService.isGrid = !this.inventoryService.isGrid;

  }

  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.onCheck();
  }

  ngOnInit() {

    this.products$ = Observable
    .combineLatest(
      this.inventoryService.collection$,
      this.sortBy$,
      this.searchKey$,
      this.selectAll$
    )
    .map(([products, sortBy, searchKey, selectAll]: [any, any, any, any]) => {
      for (let p in products) {
        (selectAll === 1) ? products[p].selected = true : products[p].selected = false;
        this.rangeFields[p] = this.calcQuantityMargin(products[p]);
      }
      products.map((item: any) => {
          if (!item.image && !_.isEmpty(item.images)) {
            item.image = item.images[0];
          }
          return item;
        }
      );
      this.products = products;
      return products;
    });

  }

  addSubscribers() {
    this.subscribers.infniteScrollSubscription = this.infiniteScroll$
    .filter((infinite) => infinite && !this.isRequest)
    .switchMap((infinite) => {
      this.isRequest = true;
      this.searchKeyLast = this.searchKey;
      //TODO remove
      if (this.total <= (this.inventoryService.current_page) * this.inventoryService.pagination_limit) {
        this.isRequest = false;
        return Observable.of(false);
      } else {
        if (this.searchKey == this.searchKeyLast) {
          ++this.inventoryService.current_page;
        }
        return this.inventoryService.getNextInventory(this.inventoryService.current_page, this.searchKey, this.sortBy);
      }
    })
    .subscribe();

    this.subscribers.totalCountSubscription = this.inventoryService.totalCount$
    .subscribe(total => this.total = total);

    this.subscribers.isDataLoadedSubscription = this.inventoryService.isDataLoaded$
    .filter(r => r)
    .do(() => this.isRequest = false)
    .delay(1000)
    .subscribe((r) => {
      this.getInfiniteScroll();
    });

    this.subscribers.locationSubscription = this.accountService.dashboardLocation$.subscribe((loc: any) =>
      this.locationId = loc ? loc['id'] : ''
    );

    this.subscribers.showLocationSliderSubscription = Observable.combineLatest(this.accountService.dashboardLocation$, this.products$)
    .filter(([location, products]) => {
      return (location && products.length);
    })
    .switchMap(([location, products]) => {
      return products.map(product => {
        product.inventory_item_locations.map(productLocation => {
          if (location.id === productLocation.location_id) {
            product.critical_level = productLocation.critical_level;
            product.overstock_level = productLocation.overstock_level;
            product.on_hand = productLocation.on_hand;
          }
        });
      });
    }).subscribe();

    this.subscribers.updateFavoriteSubscription = this.updateFavorite$
    .switchMap(inventory => this.inventoryService.setFavorite(inventory))
    .subscribe(res => {
        this.inventoryService.updateInventoryCollection(res);
        this.toasterService.pop('', res.favorite ? 'Added to favorites' : 'Removed from favorites');
      },
      err => console.log('error'));

    this.subscribers.sortBySubscription = this.sortBy$
    .filter(r => r)
    .switchMap((f) => {
      this.sortBy = f;
      return this.inventoryService.getNextInventory(0, this.searchKey, f);
    })
    .subscribe();

    this.subscribers.searchKeySubscription = this.searchKey$.debounceTime(1000)
    .filter(r => (r || r === ''))
    .subscribe(
      (r) => {
        if (r && this.sortBy === 'A-Z') {
          this.sortBy$.next('relevance');
        } else if (!r && this.sortBy === 'relevance') {
          this.sortBy$.next('A-Z');
        }
        this.searchKey = r;
        this.inventoryService.current_page = 0;
        this.inventoryService.getNextInventory(0, r, this.sortBy);
      }
    );

  }

  ngOnDestroy() {
    this.updateFavorite$.unsubscribe();
  }

  ngAfterViewInit(){
  }

  toggleInventoryItemVisibility(product) {
    product.status = !product.status;
    //TODO add save to server
  }

  searchFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }

  getInfiniteScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const toBottom = document.body.scrollHeight - scrollTop - window.innerHeight;
    const scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }

  onCheck() {
    this.selectedInventory = _.cloneDeep(this.products)
    .filter(r => r['selected']);
  }

  setFavorite(e, inventory) {
    e.stopPropagation();
    this.updateFavorite$.next(inventory);
  }

  resetFilters() {
    this.searchKey = '';
    this.sortBy = '';
    this.inventoryService.current_page = 0;
    this.inventoryService.filterParams$.next(null);
    this.inventoryService.getNextInventory(0, this.searchKey, this.sortBy).subscribe((r) => {
        this.getInfiniteScroll();
      }
    );
  }

  // sets the style of the range-field thumb;
  calcQuantityMargin(product) {

    let valueArr: number[] = [product.on_hand, product.critical_level, product.overstock_level];

    product.max = Math.max(...valueArr);
    product.min = Math.min(...valueArr);

    let quantityMargin = ((product.on_hand - product.critical_level) * 100 / (product.overstock_level - product.critical_level)).toString();
    let thumbColor = this.calcThumbColor(product.on_hand / product.overstock_level );

    let defaultLeft = {'left': '0', 'right': 'inherit'};
    let defaultRight = {'left': 'inherit', 'right': '0'};

    if (product.critical_level == null || product.overstock_level == null) {
      return { 'left': 'calc(50% - 10px)', 'background-color' : thumbColor };
    } else if (product.on_hand < product.critical_level) {
      let criticalMargin = ((product.critical_level - product.on_hand) * 100 / (product.overstock_level - product.on_hand)).toString();
      product.criticalLevel = this.checkOverlaps(criticalMargin, product);
      product.overstockLevel = defaultRight;
      return { 'left': '-18px', 'background-color' : 'red' };
    } else if (product.on_hand === product.critical_level) {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return { 'left': '-15px', 'background-color' : 'red' };
    } else if (product.on_hand > product.overstock_level) {
      let overStockMargin = ((product.overstock_level - product.critical_level) * 100 / (product.on_hand - product.critical_level)).toString();
      product.overstockLevel = this.checkOverlaps(overStockMargin, product);
      product.criticalLevel = defaultLeft;
      return { 'right': '-15px', 'background-color' : thumbColor };
    } else {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return this.checkOverlaps(quantityMargin, product, thumbColor);
    }

  }

  private checkOverlaps(margin, product, thumbColor = '#fff') {
    if (Number(margin) < 12 && product.on_hand < product.critical_level) {
      return { 'left': 'calc(12% - 5px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand > product.overstock_level) {
      return { 'left': 'calc(88% - 25px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand !== product.overstock_level) {
      return { 'left': 'calc(88% - 18px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) < 12) {
      return { 'left': 'calc(12% - 15px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else {
      return { 'left': `calc(${margin}% - 10px)`, 'background-color' : thumbColor, 'right': 'inherit' };
    }
  }

  private calcThumbColor(number: number) {
    let value = Math.min(Math.max(0, number), 1) * 510;
    let redValue;
    let greenValue;
    if (value < 255) {
      redValue = 255;
      greenValue = Math.sqrt(value) * 16;
      greenValue = Math.round(greenValue);
    } else {
      greenValue = 255;
      value = value - 255;
      redValue = 255 - (value * value / 255);
      redValue = Math.round(redValue);
    }
    return this.rgb2hex(redValue*.9,greenValue*.9,0);
  }

  private rgb2hex(red, green, blue) {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

  public openAddInventoryModal(){
    this.modal
    .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'inventoryItems': []}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          this.inventoryService.getNextInventory(0, this.searchKey, this.sortBy);
        },
        (err) => {
        }
      );
    });
  }

  showFiltersModal() {
    this.modal
    .open(InventoryGroupFiltersComponent, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }
}
