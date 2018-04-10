import { Component, OnInit } from '@angular/core';
import {ModalComponent, DialogRef, Modal} from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { SpinnerService, OrderService, VendorService } from '../../../../core/services';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {UserService} from '../../../../core/services/user.service';
import {EditEmailDataModal} from '../purchase-order/edit-email-data-modal/edit-email-data-modal.component';
import {ModalWindowService} from '../../../../core/services/modal-window.service';

export class OnlineOrderModalContext extends BSModalContext {
  public order_id: string;
  public vendor_id: string;
  constructor(o: string, v: string) {
   super();
    this.order_id = o;
    this.vendor_id = v;
  }
}

@Component({
  selector: 'app-online-order-modal',
  templateUrl: './online-order-modal.component.html',
  styleUrls: ['./online-order-modal.component.scss']
})

export class OnlineOrderModalComponent implements OnInit, ModalComponent<OnlineOrderModalContext> {
  context: OnlineOrderModalContext;
  action: 'Go to website' | 'Email' = 'Email';
  website: string;

  constructor(
    public dialog: DialogRef<OnlineOrderModalContext>,
    public spinner: SpinnerService,
    public orderService: OrderService,
    public vendorService: VendorService,
    public route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    this.vendorService.getVendor(this.context.vendor_id).subscribe(vendor => {
      this.website = vendor.website;
    });
  }

  closeModal() {
    switch (this.action) {
      case 'Go to website':
        this.convertOrder()
          .subscribe(order => {
            this.orderService.sendOrderRequestFinal(order.id, {})
              .subscribe(() => {
                if (this.website) {
                  window.open(this.website);
                }
                this.dialog.close();
              })
          });
        break;
      case 'Email':
        this.convertOrder()
          .subscribe((order: any) => {
            this.orderService.sendOrderRequest(order.id)
              .take(1)
              .subscribe((status: any) => {
                this.showEmailDataEditModal({
                  order_method: order['order_method'],
                  attachments: order['attachments'],
                  email_text: status.email_text.replace('(vendor name)', order['vendor_name']),
                  po_number: order['po_number'],
                  preview_id: order['preview_id'],
                  order_id: order['id'],
                  vendor_email: order['vendor_email_address'],
                  user_email: this.userService.selfData.email_address,
                  from_fax_number: order['from_fax_number'] || '1 11111111111',
                  rmFn: null
                });
            })});
        break;
    }
  }

  convertOrder() {
    return this.orderService.convertOrders(this.context.order_id, this.orderService.convertData)
      .map(res => res.data.order)
  }

  showEmailDataEditModal(data) {
    if (!data.email_text) {
      data.email_text = 'Email text'
    }
    if (!data.po_number) {
      data.po_number = '1234567890'
    }
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data, true, 'oldschool'));
  }

  dismissModal() {
    this.dialog.dismiss();
  }
}
