import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Modal } from 'angular2-modal';
import { Subject } from 'rxjs/Subject';

import { OrderTableService } from '../order-table.service';
import { PastOrderService } from '../../../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../../../core/services/modal-window.service';
import { SelectVendorModal } from '../../../select-vendor-modal/select-vendor.component';
import { selectedOrderModel } from '../../../../../models/selected-order.model';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { OrderTableOnVoidService } from '../order-table-on-void.service';
import { OrderStatusValues } from '../../../models/order-status';
import { OrderListType } from '../../../models/order-list-type';


@Component({
  selector: 'app-order-table-header-action',
  templateUrl: './order-table-header-action.component.html',
})
@DestroySubscribers()
export class OrderTableHeaderActionComponent implements OnInit, OnDestroy {

  public reorderOrders$: Subject<any>;

  @Input() listName: string;
  @Input() isShow: boolean;
  @Input() orders: any;

  private subscribers: any = {};

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
    public orderTableOnVoidService: OrderTableOnVoidService,
  ) {
  }

  get isReceiveList() {
    return this.listName === OrderListType.received;
  }

  get isBackorderedList() {
    return this.listName === OrderListType.backordered;
  }

  ngOnInit() {
    this.reorderOrders$ = new Subject<any>();
  }

  ngOnDestroy() {
    console.log(`${this.constructor.name} Destroys`);
  }

  addSubscribers() {
    this.subscribers.reorderOrdersSubscription = this.reorderOrders$
    .switchMap(() => {
      const filteredChecked = this.onFilterCheckedOrders();
      const data = {
        'orders': filteredChecked,
      };
      return this.pastOrderService.reorder(data);
    })
    .subscribe((res: any) => this.toasterService.pop('', res.msg));
  }

  onFilterCheckedOrders() {
    return this.orders
    .map((order: any) => {
      return new selectedOrderModel(
        Object.assign(order, {
          items_ids: [order.id],
        })
      );
    });
  }

  sendToReceiveProducts(filteredCheckedProducts, type?) {
    const sendOrders = filteredCheckedProducts.map((order) => {
      return order.order_id;
    });
    const uniqsendOrders: any[] = _.uniq(sendOrders);
    const sendItems: any[] = filteredCheckedProducts.map((order) => {
      return order.id;
    });
    const queryParams = uniqsendOrders.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams, type);
  }

  buyAgainOrders() {
    this.reorderOrders$.next('');
  }

  onVoidOrder() {
    this.orderTableOnVoidService.onVoidOrder(this.orders);
  }

  edit() {
    this.onReceiveOrders();
  }

  receive() {
    this.onReceiveOrders(OrderStatusValues.receive);
  }

  backorder() {
    this.onReceiveOrders(OrderStatusValues.backorder);
  }

  private onReceiveOrders(type?) {
    const uniqOrdersByVendors = _.uniqBy(this.orders, 'vendor_id');

    if (uniqOrdersByVendors.length === 1) {
      this.sendToReceiveProducts(this.orders, type);
    } else {
      this.modal
      .open(SelectVendorModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'vendors': uniqOrdersByVendors}, true, 'mid'))
      .then((resultPromise) => resultPromise.result)
      .then(
        (selectedVendor) => {
          const filteredOrders = _.filter(this.orders, (item: any) => selectedVendor === item.vendor_name);
          this.sendToReceiveProducts(filteredOrders, type);
        },
        (err) => {
        }
      );
    }
  }

}
