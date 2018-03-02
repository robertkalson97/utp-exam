import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location }                 from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/Rx';


import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { AccountService } from '../../../core/services/account.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { EditEmailDataModal } from '../../shopping-list/orders-preview/purchase-order/edit-email-data-modal/edit-email-data-modal.component';
import { OrderService } from '../../../core/services/order.service';
import { Subject } from 'rxjs/Subject';
import { APP_DI_CONFIG } from '../../../../../env';
import { FlaggedListService } from '../services/flagged-list.service';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
@DestroySubscribers()
export class OrderComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orderId: string;
  order$: BehaviorSubject<any> = new BehaviorSubject({});
  public updateFlagged$: any = new Subject();
  public apiUrl:string;

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public pastOrderService: PastOrderService,
    public router: Router,
    public toasterService: ToasterService,
    public orderService: OrderService,
    public flaggedListService: FlaggedListService
  ) {
    this.apiUrl = APP_DI_CONFIG.apiEndpoint;
  }

ngOnInit() {

    this.subscribers.showOrderSubscription = this.route.params
    .switchMap((p: Params) => {
      this.orderId = p['id'];
      return this.pastOrderService.getPastOrder(p['id']);
    })
    .subscribe((item: any) =>
      this.order$.next(item)
    );

  }
  addSubscribers() {
    this.subscribers.updateOrderFlaggedSubscription = this.updateFlagged$
    .switchMapTo(this.order$.first())
    .switchMap(order => this.flaggedListService.putItem(order))
    .subscribe(res => {
        this.order$.next(res);
        this.toasterService.pop('', res.flagged ? 'Flagged' : "Unflagged");
      },
      err => console.log('error'));
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  goBack(): void {
    this.windowLocation.back();
  }

  sendOrder() {
    let order = {};
    this.order$
    .map((o: any) => {
      order = Object.assign({}, o);
      return o;
    })
    .switchMap((order: any) => this.orderService.sendOrderRequest(order.id))
    .take(1)
    .subscribe((status: any) => {
      this.showEmailDataEditModal({
        order_method:order['order_method'],
        attachments: order['attachments'],
        email_text: status.email_text.replace('(vendor name)', order['vendor_name']),
        po_number: order['po_number'],
        preview_id: order['preview_id'],
        order_id: order['id'],
        vendor_email: order['vendor_email_address'],
        user_email: this.userService.selfData.email_address,
        from_fax_number: order['from_fax_number'] || '1 11111111111',
        //rmFn: this.deletePreview.bind(this, {order})
      });
    },
    (err: any) => {
    })
  }

  showEmailDataEditModal(data) {
    if (!data.email_text) {
      data.email_text = "Email text"
    }
    if (!data.po_number) {
      data.po_number = "1234567890"
    }
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data, true, "oldschool"));
  }

  setFlag(e) {
    e.stopPropagation();
    this.updateFlagged$.next(this.order$);
  }

}
