import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { PastOrderService } from '../../../core/services/pastOrder.service';

import { FlaggedListService } from '../services/flagged-list.service';
import { OrderItem } from '../models/order-item';

@Component({
  selector: 'app-flagged-list',
  templateUrl: './flagged-list.component.html',
  styleUrls: ['./flagged-list.component.scss'],
})
@DestroySubscribers()
export class FlaggedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = 'flagged';
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's1', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: 'Qty', className: 's1 bold underline-text right-align', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];

  public orders$: Observable<OrderItem[]>;

  constructor(
    private pastOrderService: PastOrderService,
    private flaggedListService: FlaggedListService,
  ) {

  };

  ngOnInit() {
    this.orders$ = this.flaggedListService.collection$;
  };

  addSubscribers() {
    this.subscribers.getFlaggedCollectionSubscription = this.flaggedListService.getCollection()
    .subscribe();
  };

  ngOnDestroy() {
    console.log('for unsubscribing');
  };

  sortByHeaderUpdated(event) {
    this.pastOrderService.updateSortBy(event.alias);
  }

  onFilterBy(value) {
    this.pastOrderService.updateFilterBy(value);
  }

}
