import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Observable';
import { BackorderedListService } from '../services/backordered-list.service';
import { OrderItem } from '../models/order-item';
import { OrderListType } from '../models/order-list-type';
import { OrderStatusAlreadyValues } from '../models/order-status';

@Component({
  selector: 'app-backordered-list',
  templateUrl: './backordered-list.component.html',
  styleUrls: ['./backordered-list.component.scss']
})
@DestroySubscribers()
export class BackorderedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.backordered;
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, },
    {name: 'Location', className: 's1', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Backordered', className: 's2', alias: 'backordered_date', filterBy: true, },
    // {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: 'Qty', className: 's1 bold underline-text right-align', aliasArray: ['backordered_qty', 'quantity'], join: '/'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];

  public orders$: Observable<OrderItem[]>;

  constructor(
    public backorderedListService: BackorderedListService,
  ) {

  };

  ngOnInit() {
    this.orders$ = this.backorderedListService.collection$
    .map((orders) => orders.map((order) => ({...order, status: OrderStatusAlreadyValues.backorder})));
  }

  addSubscribers() {
    this.subscribers.getBackorderedCollectionSubscription = this.backorderedListService.getCollection()
    .subscribe();
  };

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

}
