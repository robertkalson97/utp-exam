import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { map, filter, intersectionBy } from 'lodash';

import { PastOrderService } from '../../core/services/pastOrder.service';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { ToasterService } from '../../core/services/toaster.service';
import { OrderTableResetService } from './directives/order-table/order-table-reset.service';
import { OrderTableFilterByService } from './directives/order-table/order-table-filter-by.service';
import { OrdersPageFiltersComponent } from '../../shared/modals/filters-modal/orders-page-filters/orders-page-filters.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public visible: boolean[] = [];

  public orderTabs = {
    all: 'all',
    open: 'open',
    received: 'received',
    backordered: 'backordered',
    reconciled: 'reconciled',
    closed: 'closed',
    flagged: 'flagged',
    favorited: 'favorited',
  };

  public orderTabsArr = map(this.orderTabs, (value, key) => value);

  private activeChange$ = new Subject<{active: boolean, tab: string}>();
  private activeTab$: Observable<string>;

  public chips$;

  private filterItems$: Observable<any[]>;
  private onChipsChange$ = new Subject<string[]>();

  constructor(
      public modal: Modal,
      public router: Router,
      public pastOrderService: PastOrderService,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
      public orderTableResetService: OrderTableResetService,
      private orderTableFilterByService: OrderTableFilterByService
  ) {
  }

  ngOnInit() {
    this.activeTab$ = this.activeChange$
    .filter((event) => event.active)
    .map((event) => event.tab)
    .shareReplay(1);

    this.filterItems$ = this.activeTab$
    .switchMap((tab) =>
      this.orderTableFilterByService.getFilterByListName(tab)
    )
    .map((filterObj) => map(filterObj, (value, key) => ({value, key})))
    .map((items) => filter(items, 'value'))
    .shareReplay(1);

    this.chips$ = this.filterItems$
    .map((items) => map(items, (item) => item.value));
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {
    this.onChipsChange$
    .withLatestFrom(this.filterItems$, this.activeTab$)
    .subscribe(([chips, filterItems, tab]) => {
      const chipsObj = chips.map((value) => ({value}));
      const items = intersectionBy(filterItems, chipsObj, 'value');
      const filter = items.reduce((acc, item) => ({...acc, [item.key]: item.value}), {});
      this.orderTableFilterByService.setFilterBy(filter, tab);
    });
  }

  onChipChange(chips) {
    this.onChipsChange$.next(chips);
  }

  searchOrders(event) {
    // replace forbidden characters
    const value = event.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  };

  showFiltersModal() {
    this.modal
    .open(OrdersPageFiltersComponent, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }

  resetFilters() {
    this.pastOrderService.filterQueryParams$.next(null);
    this.orderTableResetService.resetFilters();
  }

  activeChange(active: boolean, tab: string) {
    this.activeChange$.next({active, tab});
  }
}
