import { Component, Input, OnInit } from '@angular/core';

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


@Component({
  selector: 'app-order-table-header-action',
  templateUrl: './order-table-header-action.component.html',
})
@DestroySubscribers()
export class OrderTableHeaderActionComponent implements OnInit {

  private subscribers: any = {};
  public reorderOrders$: Subject<any>;

  @Input() listName: string;
  @Input() isShow: boolean;
  @Input() orders: any;

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
    public orderTableOnVoidService: OrderTableOnVoidService,
  ) {
  }

  ngOnInit() {
    this.reorderOrders$ = new Subject<any>();
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

  onReceiveOrders() {
    const uniqOrdersByVendors = _.uniqBy(this.orders, 'vendor_id');

    if (uniqOrdersByVendors.length === 1) {
      this.sendToReceiveProducts(this.orders);
    } else {
      this.modal
      .open(SelectVendorModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'vendors': uniqOrdersByVendors}, true, 'mid'))
      .then((resultPromise) => {
        resultPromise.result.then(
          (selectedVendor) => {
            const filteredOrders = _.filter(this.orders, (item: any) => selectedVendor === item.vendor_name);
            this.sendToReceiveProducts(filteredOrders);
          },
          (err) => {
          }
        );
      });
    }
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

  sendToReceiveProducts(filteredCheckedProducts, singleOrder = false) {
    const sendOrders = filteredCheckedProducts.map((order) => {
      return order.order_id;
    });
    const uniqsendOrders: any[] = _.uniq(sendOrders);
    const sendItems: any[] = filteredCheckedProducts.map((order) => {
      return order.id;
    });
    const queryParams = uniqsendOrders.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
  }

  buyAgainOrders() {
    this.reorderOrders$.next('');
  }

  onVoidOrder() {
    this.orderTableOnVoidService.onVoidOrder(this.orders);
  }
}
