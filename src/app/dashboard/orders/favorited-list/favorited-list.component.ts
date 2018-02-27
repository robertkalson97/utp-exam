import { Component, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-favorited-list',
  templateUrl: './favorited-list.component.html',
  styleUrls: ['./favorited-list.component.scss'],
})
@DestroySubscribers()
export class FavoritedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public listName: string = 'favorited';
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, },
    {name: 'Location', className: 's1', alias: 'location', filterBy: true, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: 'Qty', className: 's1 bold underline-text', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1 bold underline-text', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];


  public orders$: Observable<any>;

  constructor(
    public pastOrderService: PastOrderService,
  ) {

  };
  
  ngOnInit() {
    this.orders$ = this.pastOrderService.favoritedListCollection$;
  };
  
  addSubscribers() {
    this.subscribers.getFavoritedCollectionSubscription = this.pastOrderService.getFavoritedProducts()
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
