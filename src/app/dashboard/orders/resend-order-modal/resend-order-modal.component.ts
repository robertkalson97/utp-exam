import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { EditEmailDataModal } from '../../shopping-list/orders-preview/purchase-order/edit-email-data-modal/edit-email-data-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Subject } from 'rxjs/Subject';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { APP_DI_CONFIG } from '../../../../../env';
import { Router } from '@angular/router';

export class ResendOrderModalContext extends BSModalContext {
  public order: any;
}

@Component({
  selector: 'app-resend-order-modal',
  templateUrl: './resend-order-modal.component.html',
  styleUrls: ['./resend-order-modal.component.scss']
})
@DestroySubscribers()
export class ResendOrderModal implements OnInit, CloseGuard, ModalComponent<ResendOrderModalContext> {
  public subscribers: any = {};
  public context: any;
  public emailModalData$: any = new Subject();
  public apiUrl: string;
  
  constructor(
    public dialog: DialogRef<ResendOrderModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public pastOrderService: PastOrderService,
    public orderService: OrderService,
    public userService: UserService,
    public router: Router,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.apiUrl = APP_DI_CONFIG.apiEndpoint;
  }
  
  ngOnInit() {
    console.log(this.context, 'Resend context');
  }
  
  addSubscribers() {
    let order = {};
    
    this.subscribers.sendEmailModalSubscription = this.emailModalData$
    .switchMap(() => this.pastOrderService.getPastOrder(this.context.order_id))
    .map((o: any) => {
      order = Object.assign({}, o);
      return o;
    })
    .switchMap((order) => this.orderService.sendOrderRequest(this.context.order_id))
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
          rmFn: null,
        });
        this.dismissModal();
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
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data, true, "oldschool"))
  }
  
  dismissModal(){
    this.dialog.dismiss();
  }
  
  closeModal(data){
    this.dialog.close(data);
  }
  
  openEmailModal() {
    this.emailModalData$.next('');
  }
  
}
