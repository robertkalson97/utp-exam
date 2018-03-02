import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OrderTableResetService } from './order-table-reset.service';
import { Subscription } from 'rxjs/Subscription';
import { OrderTableFilterByService } from './order-table-filter-by.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Injectable()
export class OrderTableService {
  uniqueField: string;

  orders$: Observable<any>;
  setOrders$: Subject<any>;
  countOrders$: BehaviorSubject<any>;

  toggleBatchSelect$: Subject<any>;
  toggleSelect$: Subject<any>;
  batchSelect$: Observable<any>;
  filterByObject$: Observable<any>;

  listName$ = new ReplaySubject<string>(1);

  private filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private resetSubscription: Subscription;

  constructor(
    private orderTableResetService: OrderTableResetService,
    private orderTableFilterByService: OrderTableFilterByService,
  ) {
    this.toggleBatchSelect$ = new Subject();
    this.toggleSelect$ = new Subject();
    this.setOrders$ = new Subject();
    this.countOrders$ = new BehaviorSubject<any>(null);
    this.filterByObject$ = this.filterBy$
    .scan((acc, value) => {
      return value ? {...acc, ...value} : {};
    });

    this.orders$ = Observable.combineLatest(
      this.setOrders$
      .filter((orders) => !!orders)
      .map((orders) => {
        this.countOrders$.next(orders.length);
        return orders.map(order => ({checked: false, ...order}));
      })
      .switchMap((orders) => {

        return this.toggleBatchSelect$
        .switchMap(() => {
          return this.batchSelect$.take(1);
        })
        .map((checked) => {
          return orders.map(order => {
            order.checked = checked;
            return order;
          });
        })
        .startWith(orders);
      }),
      this.listName$.switchMap((listName) =>
        this.orderTableFilterByService.getFilterByListName(listName)
      ),
    )
    .map(([orders, filter]: [any, any]) => {
      if (filter) {
        return _.filter(orders, filter);
      }
      return orders;
    })
    .shareReplay(1);


    this.batchSelect$ = Observable.of(null).merge(
      this.toggleBatchSelect$,
      this.toggleSelect$.withLatestFrom(this.orders$)
      .map(([id, orders]) => {
        return orders
        .map(order => {
          order.checked = order[this.uniqueField] === id ? !order.checked : order.checked;
          return order;
        })
        .every((order) => {
          return order.checked;
        });
      })
    )
    .scan((acc, newValue) => {
      if (_.isUndefined(newValue)) {return !acc; }
      return newValue;
    }).publishReplay(1).refCount();

    this.resetSubscription = this.orderTableResetService.resetFilters$
    .subscribe(res => this.filterBy$.next(null));

  }

  toggleSelectAll() {
    this.toggleBatchSelect$.next();
  }

  toggleSelect(id) {
    this.toggleSelect$.next(id);
  }

  onFilterByAlias(value, headerCol) {
    this.filterBy$.next({[headerCol.alias]: value });
  }

  destroySubscription() {
    if (this.resetSubscription && this.resetSubscription.unsubscribe) {
      this.resetSubscription.unsubscribe();
    }
  }

}
