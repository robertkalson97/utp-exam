import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-backordered-list',
  templateUrl: './backordered-list.component.html',
  styleUrls: ['./backordered-list.component.scss']
})
@DestroySubscribers()
export class BackorderedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public listName: string = 'backordered';
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'product_name', filterBy: true, },
    {name: 'Location', className: 's2', alias: 'location', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Backordered', className: 's2', alias: 'backordered_date', filterBy: true, },
    {name: 'Qty', className: 's1 bold underline-text', alias: 'backordered_qty'},
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
    this.orders$ = this.pastOrderService.backorderedListCollection$
  }

  addSubscribers() {
    this.subscribers.getBackorderedCollectionSubscription = this.pastOrderService.getBackorderedProducts()
    .subscribe();
  };
  
  ngOnDestroy() {
    console.log('for unsubscribing');
  }
  
}
