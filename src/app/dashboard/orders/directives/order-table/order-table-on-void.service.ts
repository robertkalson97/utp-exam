import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { Modal } from 'angular2-modal';
import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderTableService } from './order-table.service';
import { selectedOrderModel } from '../../../../models/selected-order.model';
import { ConfirmModalService } from '../../../../shared/modals/confirm-modal/confirm-modal.service';


@Injectable()
export class OrderTableOnVoidService {
  private voidOrder$: Subject<any>;
  private voidCheckedOrders$: Subject<any>;
  private openConfirmVoidModal$: Subject<any>;

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
    public confirmModalService: ConfirmModalService,
  ) {
    this.voidOrder$ = new Subject<any>();
    this.voidCheckedOrders$ = new Subject<any>();
    this.openConfirmVoidModal$ = new Subject();

    this.openConfirmVoidModal$
    .switchMap((data) =>
      this.confirmModalService.confirmModal(
      'Void?', {text: 'Set order status to "Void"?', btn: 'Void'}
      )
      .filter(({success}) => success)
      .mapTo(data)
    )
    .switchMap((data: any) => {
      let orders;
      if (_.isArray(data)) {
        const filteredChecked = this.onFilterCheckedOrders(data);
        orders = {
          'orders': filteredChecked,
        };

      } else {
        orders = {
          'orders': [
            {
              'order_id': data.order_id,
              'items_ids': [data.id],
            }
          ]
        };
      }
      return this.pastOrderService.onVoidOrder(orders);
    })
    .subscribe();

  }
  
  onVoidOrder(data) {
    this.openConfirmVoidModal$.next(data);
  }

  onFilterCheckedOrders(orders) {
    return orders
    .map((order: any) => {
      return new selectedOrderModel(
        Object.assign(order, {
          items_ids: [order.id],
        })
      );
    });
  }

}
