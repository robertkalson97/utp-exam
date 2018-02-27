import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange,
  SimpleChanges
} from '@angular/core';

import { Router } from '@angular/router';
import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { ToasterService } from '../../../../core/services/toaster.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { OrderTableSortService } from './order-table-sort.service';
import { OrderTableService } from './order-table.service';
import { OrderTableOnVoidService } from './order-table-on-void.service';


@Component( {
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  providers: [
    OrderTableSortService,
    OrderTableService,
    OrderTableOnVoidService,
  ]
})

@DestroySubscribers()

export class OrderTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input('uniqueField') public uniqueField: string;
  @Input('header') public header: any = [];
  @Input('listName') public listName: string = '';
  @Output() sortByHeaderUpdated = new EventEmitter();
  @Output() filterBy = new EventEmitter();
  @Input()
  set orders(value){
    this.orderTableService.setOrders$.next(value);
  }
  
  public componentId: string = _.uniqueId();
  public subscribers: any = {};
  
  public filteredOrders$:  Observable<any>;
  public checkedOrders$:  Observable<any>;
  
  private showHeaderMenu$: Observable<any>;
  
  constructor(
    public modal: Modal,
    public router: Router,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableSortService: OrderTableSortService,
    public orderTableService: OrderTableService,
  ) {
  
  }
  
  ngOnInit() {
    this.filteredOrders$ = Observable.combineLatest(
      this.orderTableService.orders$,
      this.orderTableSortService.sort$.startWith(null),
      this.orderTableService.toggleSelect$.startWith(null),
    )
    .map(([orders, sort]: [any, any]) => {
      if (!sort) {
        return orders;
      }
        return _.orderBy(orders, [sort.alias], [sort.order]);
    });
    
    this.checkedOrders$ = this.filteredOrders$
    .map(orders => {
      return orders.filter(order => order.checked);
    });
    
    this.showHeaderMenu$ = this.filteredOrders$
    .map((orders) => {
      return _.findIndex(orders, {checked: true}) >= 0;
    });
    
  }
  
  ngOnDestroy() {
    this.orderTableService.destroySubscription();
    this.orderTableSortService.destroySubscription();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const uniqueField: SimpleChange = changes.uniqueField;
    if (uniqueField) {
      this.orderTableService.uniqueField = uniqueField.currentValue;
    }
  }
  
  setCheckbox(item) {
    this.orderTableService.toggleSelect(item[this.uniqueField]);
  }
  
  toggleSelectAll() {
    this.orderTableService.toggleSelectAll();
  }
  
  sortByHeaderCol(headerCol) {
    if (!headerCol.alias) {
      return;
    }
    this.orderTableSortService.sortByAlias(headerCol.alias);
  }
  
  onFilterBy(value, headerCol) {
    
    this.orderTableService.onFilterByAlias(value, headerCol);
    
    this.filterBy.emit(value);
  }

  toggleStatusHistoryDetail(item) {
    item.statusHistoryVisibility = !item.statusHistoryVisibility;
  }

}
