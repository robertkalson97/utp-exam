import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ReceivedOrderService } from '../../../core/services/received-order.service';

import { ReceiveOrderItemModel } from './models/order-item-form.model';
import { ReceiveOrderModel } from './models/order-form.model';
import { ReceiveFormModel } from './models/receive-form.model';
import { ReceivedInventoryGroupModel } from './models/received-inventory-group.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ReceiveService {

  public invoice$: Observable<ReceiveFormModel>;
  public invoiceOrders$: Observable<ReceiveOrderModel[]>;
  public invoiceItems$: Observable<ReceiveOrderItemModel[]>;
  public inventoryGroups$: Observable<ReceivedInventoryGroupModel[]>;
  public orderEntities$: Observable<{[order_id: string]: ReceiveOrderModel}>;
  public itemEntities$: Observable<{[item_id: string]: ReceiveOrderItemModel}>;
  public inventoryGroupEntities$: Observable<{[inventory_group_id: string]: ReceivedInventoryGroupModel}>;
  public takeInvoiceData$: Subject<any> = new Subject();

  public formSubmitted$: Observable<boolean>;
  private formSubmittedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public receivedOrderService: ReceivedOrderService,
  ) {

    this.invoice$ = this.takeInvoiceData$
    .switchMap((param) =>
      this.receivedOrderService.getReceiveProduct(param.queryParams)
    )
    .shareReplay(1);

    this.invoiceOrders$ = this.invoice$
    .map((invoice) => invoice.orders);

    this.orderEntities$ = this.invoiceOrders$
    .map((collection) => collection.reduce((entities, item) => ({
      ...entities,
      [item.order_id]: item,
    }), {}));

    this.invoiceItems$ = this.invoiceOrders$
    .map((invoiceOrders) =>
      invoiceOrders.reduce((acc: any[], order) =>
        [...acc, ...order.items], []
      )
    );

    this.itemEntities$ = this.invoiceItems$
    .map(this.createEntities);

    this.inventoryGroups$ = this.invoiceItems$
    .map((invoiceItems) =>
      invoiceItems.reduce((inventoryGroups: any[], item) => {
        const itemInventoryGroup = (item.inventory_group) ? [item.inventory_group] : item.inventory_groups;
        return  [...inventoryGroups, ...itemInventoryGroup];
        }, []
      )
    );

    this.inventoryGroupEntities$ = this.inventoryGroups$
    .map(this.createEntities);

    this.formSubmitted$ = this.formSubmittedSubject$.asObservable();
  }

  getOrder(id: string) {
    return this.orderEntities$
    .map((entities) => entities[id]);
  };

  getItem(id: string) {
    return this.itemEntities$
    .map((entities) => entities[id]);
  };

  getInventoryGroup(id: string) {
    return this.inventoryGroupEntities$
    .map((entities) => entities[id]);
  };

  getInventoryGroups(ids: string[]) {
    return this.inventoryGroupEntities$
    .map((entities) => ids.map((id) => entities[id]));
  }


  createEntities(collection) {
    return collection.reduce((entities, item) => ({
      ...entities,
      [item.id]: item,
    }), {});
  }

  takeInvoiceData(param) {
    this.takeInvoiceData$.next(param);
    return this.invoice$;
  }

  formSubmitted(value = true) {
    this.formSubmittedSubject$.next(value);
  }

}
